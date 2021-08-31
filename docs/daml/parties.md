# Parties

At this time, it is required that Sextant be responsible for JWT token
generation in order to use Sextant to create and manage parties as well as
generate tokens.

## Getting to the Daml Parties screen

1. Open the sidebar using the icon at the top left of the Sextant screen

   ![Sidebar](../images/sidebar.png)

2. Click on the Deployments link which will bring you to the Deployments list

  ![Deployments](../images/deployment-list.png)

3. Find your deployment and click on the gear icon to the left of the deployment
   entry. This will bring you to the Daml Parties screen.

   ![Daml Parties](../images/daml-parties-fresh.png)

## Adding a party

To add a party to a daml ledger:

1. Find the "Local Participants" box

  ![Local Participants](../images/local-participants-closed.png)

2. Click on the down arrow next to a participant to expand it

   ![Local Participants - Expanded](../images/local-participants-open-empty.png)

3. Click on the "Add Party" button which will bring up the add party-dialog

   ![Add a Party](../images/add-party.png)

4. Enter the party name and a display hint for the party and click "Save". In a
   moment you should see your new party added to the particpant list, as well as
   the "All Parties" list.

   ![Local Participants - With Entries](../images/local-participants-with-entries.png)

  ![All Parties](../images/all-parties.png)

## Creating a token

To create a token allowing access for one or more parties:

1. Find the "Local Participants" box

  ![Local Participants](../images/local-participants-closed.png)

2. Click on the down arrow next to a participant to expand it

   ![Local Participants - Expanded](../images/local-participants-multiple-parties.png)

3. Click on "Generate Tokens" which will bring you to the "Party Access Token"
   dialog

   ![Party Access Token](../images/create-access-token-blank.png)

4. Fill out the form and select the parties and privileges as desired and click
   "Create Token".

   ![Party Access Token - Filled](../images/create-access-token-filled.png)

   This will bring you to the "Party Access Token" dialog. IMPORTANT! You must
   save the generated token somewhere appropriate.  It may not be recovered,
   but a new token with identical privileges may be created.

   ![Party Access Token - Created](../images/party-access-token.png)

## Generating an Admin Access Token

1. Find the "Box" box

  ![Local Participants](../images/admin-box.png)

2. Click on the "Generate Admin Token" button. This will immediately generate
   a new admin token. IMPORTANT! You must
   save the generated token somewhere appropriate.  It may not be recovered,
   but a new token with identical privileges may be created.

   ![Admin Token](../images/party-access-token.png)
