import React, { useState } from 'react'
import { styled } from '@mui/system'

import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'

import DomainInput from '../../../components/chronicle/DomainInput'

interface RenderTree {
    id: string
    name: string
    meta?: { [key: string]: any };
    children?: RenderTree[]
}

const data: RenderTree[] = [
    {
      id: 'agents',
      name: 'Agents',
      children: [
        {
          id: 'person',
          name: 'Person',
          children: [
                {
                    id: 'attributes9',
                    name: 'Attributes',
                    children: [
                        {
                            id: 'CMSId',
                            name: 'CMSId',
                            meta: [
                                {
                                    id: 'CMSId_s9d68gf7',
                                    name: 'CMSId_s9d68gf7',
                                    description: 'Lorem Ipsum dolor sit amet',
                                },
                            ],
                        },
                    ],
                }
            ],
        },
        {
          id: 'organization',
          name: 'Organization',
          children: [
            {
              id: 'attributes10',
              name: 'Attributes',
              children: [
                    {
                        id: 'title',
                        name: 'Title',
                        meta: [
                            {
                                id: 'title_s9d68gf7',
                                name: 'title_s9d68gf7',
                                description: 'Lorem Ipsum dolor sit amet',
                            },
                        ],
                    },
              ],
            },
          ],
        },
      ],
    },
    {
        id: "entities",
        name: "Entities",
        children: [
          {
            id: "Question",
            name: "Question",
            children: [
              {
                id: "attribute5",
                name: "Attributes",
                children: [
                  {
                    id: "CMSId",
                    name: "CMSId",
                    meta: [
                      {
                        id: "CMSId_s9d68gf7",
                        name: "CMSId_s9d68gf7",
                        description: "Lorem Ipsum dolor sit amet"
                      }
                    ]
                  },
                  {
                    id: "Content",
                    name: "Content",
                    meta: []
                  }
                ]
              }
            ]
          },
          {
            id: "Evidence",
            name: "Evidence",
            children: [
              {
                id: "attribute6",
                name: "Attributes",
                children: [
                  {
                    id: "SearchParameter",
                    name: "SearchParameter",
                    meta: []
                  },
                  {
                    id: "Reference",
                    name: "Reference",
                    meta: []
                  }
                ]
              }
            ]
          },
          {
            id: "Guidance",
            name: "Guidance",
            children: [
              {
                id: "attribute7",
                name: "Attributes",
                children: [
                  {
                    id: "Title",
                    name: "Title",
                    meta: []
                  },
                  {
                    id: "Version",
                    name: "Version",
                    meta: []
                  }
                ]
              }
            ]
          },
          {
            id: "PublishedGuidance",
            name: "PublishedGuidance",
            children: [
              {
                id: "attribute8",
                name: "Attributes",
                children: []
              }
            ]
          }
        ]
    },
    {
        id: "activities",
        name: "Activities",
        children: [
          {
            id: "QuestionAsked",
            name: "QuestionAsked",
            children: [
              {
                id: "attributes4",
                name: "Attributes",
                children: [
                  {
                    id: "Content",
                    name: "Content",
                    meta: []
                  }
                ]
              }
            ]
          },
          {
            id: "Researched",
            name: "Researched",
            children: [
              {
                id: "attributes1",
                name: "Attributes",
                children: []
              }
            ]
          },
          {
            id: "Published",
            name: "Published",
            children: [
              {
                id: "attributes2",
                name: "Attributes",
                children: [
                  {
                    id: "Version",
                    name: "Version",
                    meta: []
                  }
                ]
              }
            ]
          },
          {
            id: "Revised",
            name: "Revised",
            children: [
              {
                id: "attributes3",
                name: "Attributes",
                children: [
                  {
                    id: "CMSId",
                    name: "CMSId",
                    meta: []
                  },
                  {
                    id: "Version",
                    name: "Version",
                    meta: []
                  }
                ]
              }
            ]
          }
        ]
      }
]

const Explorer: React.FC = () => {
    const [selectedMeta, setSelectedMeta] = useState(null)
    const [options, setOptions] = useState<string[]>([
        'https://example.com',
        // any other initial options
    ])

    const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
        const selectedNode = findNodeById(data, nodeId);
        setSelectedMeta(selectedNode?.meta || null);
    };

    const findNodeById = (nodes: RenderTree[], id: string): RenderTree | null => {
        for (let node of nodes) {
            if (node.id === id) {
                return node;
            }
            if (node.children) {
                const foundNode = findNodeById(node.children, id);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    };

    const renderTree = (nodes: RenderTree) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
    )

    const renderObject = (obj: { [key: string]: any }) => {
        return Object.entries(obj).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={key}>
                <strong>{key}:</strong>
                {renderObject(value)}
              </div>
            );
          } else {
            return (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            );
          }
        });
      }

    const handleOptionAdd = (newOption: string) => {
    setOptions(prevOptions => [...prevOptions, newOption])
    }

    const handleOptionRemove = (optionToRemove: string) => {
    setOptions(prevOptions => prevOptions.filter(option => option !== optionToRemove));
    }

    return (
        <Container maxWidth={false} sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <DomainInput options={options} onOptionAdd={handleOptionAdd} onOptionRemove={handleOptionRemove} />
            <Divider sx={{ my: 2 }} />
            <Grid container sx={{ my: 2, flex: 1 }}>
                <Grid item xs={6} sx={{ p: 2 }}>
                    <TreeView
                        aria-label="rich object"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={handleNodeSelect}
                        >
                            {data.map((node) => renderTree(node))}
                    </TreeView>
                </Grid>
                <Grid container xs={6} sx={{
                        p: 2,
                        borderRadius: (theme) => theme.shape.borderRadius,
                        backgroundColor: (theme) => theme.palette.grey[100]
                    }}>
                {selectedMeta &&
                        <div>
                            {renderObject(selectedMeta)}
                        </div>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Explorer
