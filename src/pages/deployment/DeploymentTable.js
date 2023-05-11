/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { styled } from '@mui/material/styles';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import SimpleTable from 'components/table/SimpleTable';
import SimpleTableTripleDeleteDialog from 'components/table/SimpleTableTripleDeleteDialog';
import SimpleTableHeader from 'components/table/SimpleTableHeader';
import SimpleTableActions from 'components/table/SimpleTableActions';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';

import RedirectButton from 'components/layout/RedirectButton';
import TaskStatusIcon from 'components/status/TaskStatusIcon';
import TaskActionIcon from 'components/status/TaskActionIcon';

import settings from 'settings';

import rbac from 'utils/rbac';
import { getFirstTagForDeployment } from 'utils/deployment_settings_page';

import {
  actionNameTranslator,
  deploymentStatusTranslator,
  getDeploymentIcon,
  getDeploymentIconTitle,
} from '../../utils/translators';

const AddIcon = settings.icons.add;
const EditIcon = settings.icons.edit;
const ViewIcon = settings.icons.view;
const SettingsIcon = settings.icons.settings;
const EmptyIcon = settings.icons.settings;

const styles = (theme) => ({
  errorText: {
    color: theme.palette.error.main,
  },
  errorContainer: {
    maxWidth: '200px',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  statusIcon: {
    marginRight: theme.spacing(2),
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    alignItems: 'center',
  },
  clusterSelect: {
    marginRight: theme.spacing(2),
  },
  hideDeletedCheckbox: {
    marginRight: theme.spacing(2),
  },
  hideDeletedLabel: {
    whiteSpace: 'nowrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  embeddedHeader: {
    paddingLeft: '0px',
  },
});

const Connector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
  },
}));

class DeploymentTable extends React.Component {
  state = {
    deleteConfirmOpen: false,
    deleteConfirmItem: null,
  };

  openDeleteDialog(item) {
    this.setState({
      deleteConfirmOpen: true,
      deleteConfirmItem: item,
    });
  }

  closeDeleteDialog() {
    this.setState({
      deleteConfirmOpen: false,
    });
  }

  render() {
    const {
      classes,
      deployments,
      onClickAddButton,
      onAdd,
      onEdit,
      onViewStatus,
      onViewSettings,
      onDelete,
      updateHideDeleted,
      clusters,
      cluster,
      clusterId,
      updateClusterId,
      deploymentForms,
      embedded,
      user,
    } = this.props;
    const { deleteConfirmOpen, deleteConfirmItem } = this.state;

    let fields = [
      {
        title: 'Name',
        name: 'name',
      },
      {
        title: 'Cluster',
        name: 'clusterName',
      },
      {
        title: 'Type',
        name: 'deployment_type',
      },
      {
        title: 'Status',
        name: 'status',
      },
      {
        title: 'Task',
        name: 'task',
      },
    ];

    if (embedded) {
      fields = fields.filter((f) => f.name !== 'clusterName');
    }

    const data = deployments.map((deployment) => ({
      id: deployment.id,
      cluster: deployment.cluster,
      deploymentData: deployment,
      role: deployment.role,
      name: deployment.name,
      clusterName: deployment.clusterName,
      deployment_type: deployment.deployment_type,
      status: deploymentStatusTranslator(deployment.status),
      task: deployment.task ? (
        <Stepper activeStep={1} connector={<Connector />}>
          <Step>
            <TaskActionIcon
              action={deployment.task.action.split('.')[1]}
              actionLabel={actionNameTranslator(deployment.task.action)}
            />
          </Step>
          <Step>
            <TaskStatusIcon
              status={deployment.task.status}
              error={deployment.task.error}
            />
          </Step>
        </Stepper>
      ) : null,
    }));

    // holds an array of deployment types
    const addButtonItems = Object.keys(deploymentForms).map(
      (deploymentType) => {
        const formConfig = deploymentForms[deploymentType];
        // versions is an array of objects.
        // Each object contains data for a version of the deploymentType
        return {
          order: formConfig.order,
          versions: formConfig.button.versions.map((version) => ({
            icon: version.icon,
            title: version.title,
            version: version.version,
            description: version.description,
            handler: () => onAdd(clusterId, deploymentType, version.form),
          })),
        };
      },
    );
    // remove charts that are not helm charts
    const helmAddButtonItems = addButtonItems.filter((item) => item.order >= 0);

    // sort the helm charts beased on the order value
    helmAddButtonItems.sort((a, b) => (a.order > b.order ? 1 : -1));

    let addButtonDisabled = true;

    if (clusterId !== 'all') {
      const canWriteToCluster = rbac({
        user,
        action: {
          resource_type: 'cluster',
          resource_id: clusterId,
          method: 'write',
        },
      });

      addButtonDisabled = !canWriteToCluster;
    }

    const addButton = (
      <div className={classes.addButton}>
        <RedirectButton
          cluster={clusterId}
          onClick={onClickAddButton}
          className={classes.button}
          title="Add"
          icon={AddIcon}
          buttonProps={{
            variant: 'contained',
            color: 'primary',
          }}
          items={helmAddButtonItems}
          disabled={addButtonDisabled}
        />
      </div>
    );

    const headerActions = embedded ? (
      <div className={classes.headerActions}>
        <div className={classes.hideDeletedCheckbox}>
          <FormControlLabel
            control={(
              <Checkbox
                onChange={(event) => updateHideDeleted(event.target.checked)}
                value="checkedB"
                color="primary"
              />
            )}
            label="Hide Undeployed"
            classes={{
              label: classes.hideDeletedLabel,
            }}
          />
        </div>
        {addButton}
      </div>
    ) : (
      <div className={classes.headerActions}>
        <div className={classes.clusterSelect}>
          <FormControl variant="standard" className={classes.formControl} _ci="formControl">
            <InputLabel htmlFor="name-readonly">Cluster</InputLabel>
            <Select
              value={clusterId}
              onChange={(ev) => updateClusterId(ev.target.value)}
            >
              {[
                {
                  id: 'all',
                  name: 'all',
                },
              ]
                .concat(clusters)
                .map((eachCluster, i) => (
                  <MenuItem key={i} value={eachCluster.id}>
                    {eachCluster.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        {addButton}
      </div>
    );

    const getActions = (deployment) => {
      const buttons = [];
      if (
        rbac({
          user,
          action: {
            resource_type: 'deployment',
            resource_id: deployment.id,
            method: 'write',
          },
        })
      ) {
        buttons.push({
          title: getDeploymentIconTitle(deployment.status),
          icon: getDeploymentIcon(deployment.status, settings),
          handler: (item) => this.openDeleteDialog(item),
        });
        buttons.push({
          title: 'Edit',
          icon: EditIcon,
          handler: (item) => onEdit(item.cluster, item.id),
        });
      }

      buttons.push({
        title: 'View',
        icon: ViewIcon,
        disabled: deployment.status === 'undeployed',
        handler: (item) => onViewStatus(item.cluster, item.id),
      });

      const undeployed = deployment.status !== 'deployed';
      // eslint-disable-next-line camelcase
      const { deployment_type } = deployment;
      const deploymentsWithSettings = [
        'daml-on-sawtooth',
        'daml-on-besu',
        'daml-on-qldb',
        'daml-on-postgres',
        'tfs-on-sawtooth',
      ];

      if (deploymentsWithSettings.includes(deployment_type)) {
        buttons.push({
          title: 'Settings',
          icon: SettingsIcon,
          disabled: undeployed,
          handler: (item) => {
            const pageKey = getFirstTagForDeployment(
              deploymentForms,
              item.deployment_type,
              item.deploymentData.deployment_version,
            );
            return onViewSettings(
              item.cluster,
              item.id,
              item.deployment_type,
              item.deploymentData.deployment_version,
              pageKey,
            );
          },
        });
      } else {
        buttons.push({
          title: 'Empty',
          icon: EmptyIcon,
          disabled: true,
          className: 'emptyIcon',
          style: { opacity: 0 },
        });
      }
      return buttons;
    };

    const getItemStatus = (item) => (item.status === 'undeployed' ? ' permanently' : '');

    const clusterTitle = cluster
      ? `${cluster.name}: Deployments`
      : 'Deployments';
    const title = embedded ? 'Deployments' : clusterTitle;
    return (
      <div>
        <SimpleTableHeader
          title={title}
          getActions={() => headerActions}
          className={embedded ? classes.embeddedHeader : null}
        />
        <SimpleTable
          pagination
          data={data}
          fields={fields}
          // eslint-disable-next-line react/no-unstable-nested-components
          getActions={(item) => {
            if (
              item.deploymentData.task
              && item.deploymentData.task.status === 'running'
            ) { return null; }
            return (
              <SimpleTableActions item={item} actions={getActions(item)} />
            );
          }}
        />
        <SimpleTableTripleDeleteDialog
          resourceType="deployment"
          resource={deleteConfirmItem}
          open={deleteConfirmOpen}
          title={
            deleteConfirmItem
              ? `the ${deleteConfirmItem.name} deployment ${getItemStatus(
                deleteConfirmItem,
              )}`
              : null
          }
          onCancel={() => this.closeDeleteDialog()}
          onConfirm={() => {
            this.closeDeleteDialog();
            onDelete(clusterId, deleteConfirmItem.id);
          }}
        />
      </div>
    );
  }
}

DeploymentTable.propTypes = {
  classes: PropTypes.object.isRequired,
  deployments: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(DeploymentTable);
