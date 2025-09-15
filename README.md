# Assignment

## Project overview

This is a full stack web application:
- **Frontend:** Developed using TypeScript and React.
- **Backend:** Built with TypeScript and NodeJs.
- **Database:** Used PostgreSQL for data storage.

## Project Structure

xDigital/
- frontend_react/ (frontend source code)
- backend_node/  (backend source code)
- database/  (Database scripts or migrations)
- .env (Environment variables excluded from git)
- docker-compose.yml (Docker compose configuration)

## Getting Started
### Prerequisites

- Node.js (v22 recommended)
- Docker and Docker Compose
- PostgreSQL database
- Ubuntu 24
### Installation & Running
- Create a .env file in the root directory
    
    Example of env file contents:
    ```
        GEMINI_API_KEY=<GEMINI_API_KEY>
    ```
    ** Note: If there is no or incorrect GEMINI API KEY, the backend will not be able to run.
    
    ** Note: if running independent for backend, need to have ```DB_HOST=localhost``` and docker compose is ```DB_HOST=postgres``` due to the docker image

- Start the app using docker compose (build and run)
    ```
    docker compose up --build

- Access the frontend at http://localhost:3000 and backend API at http://localhost:3001

NOTE: Any existing postgresql service on the host machine must be stop as docker postgresql will run the same port

## Features
- The database is pre-populated with the data below:

    | Developer | Skills             |
    |-----------|--------------------|
    | Alice     | Frontend           |
    | Bob       | Backend            |
    | Carol     | Frontend, Backend  |
    | Dave      | Backend            |

- In the task list page as below:
    | Task Title | Skills|Status|Assignee|
    |------------|-------|------|--------|
    |{Description}     |Frontend| To-do (Drop down}|Assign Developer (Drop down) |
    
    - The Status column will be the status (To-do / Done)
    ### Assignee appear only with skill associated with task's skill
    - The Assignee column will display the task that can only be assigned to developer with skills according to the Task skill required. 
    <br>Example, the task skill required Frontend, so only Alice, Carol will appear in the drop down field.

    ### Status display 'Done' if all subtasks are completed
    - For the task that has subtasks, the subtask must be completed else parent task will not be able to marked as Done
    ### Parent task status display 'To-do' if one subtask change to 'To-do'
    - Parent task is set to Done when all subtasks are done. If one of the subtask set to 'To-do', the associated parents will be changed to 'To-do'.
    ### Task Creation with nested subtasks
    - On the top right corner "Create Task" will allow user to create Task with Task description and optional required skills (Frontend/Backend)
    - Task can create nested subtasks with the task, need to click **"Add Subtask"** then click **"Save"**. If user did not click **"Add Subtask"** then subtask will not be saved.
    ### Task Creation with LLM input on required skills
    - If task that does not have select the Required skills (Frontend or Backend), the application will query with LLM to associate the task with the required skills.
