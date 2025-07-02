# ⚙️ AWS Lambda Functions for Task App Backend

This project includes a set of AWS Lambda functions used to interact with a DynamoDB table for the Task App. The Lambda function handles creating, reading, updating, and deleting task items via API Gateway events.

## 📁 Files Overview

### `lambda_function.py`

This is the Lambda entry point. It delegates all business logic to `DynamoDB`, defined in `dynamodb_handler.py`.

```python
from dynamodb_handler import DynamoDB

def lambda_handler(event, context):
    ddb = DynamoDB(event)
    items = ddb.main()
    return {
        'statusCode': 200,
        'items': items
    }
```

### `dynamodb_handler.py`

Contains the `DynamoDB` class that abstracts operations on your DynamoDB table. These include:

- `scan_items()` — Reads all items from the table

- `new_task()` — Adds a new task

- `delete_task()` — Deletes a task by key

- `update_task()` — Updates the "complete" status

- `main()` — Determines what operation to run based on event data

## 🛠️ Supported Actions

The Lambda function supports the following operations via a POST request body:

| Action | Description              | Required Fields              |
| ------ | ------------------------ | ---------------------------- |
| add    | Adds a new task          | `task`, `complete`, `action` |
| delete | Deletes an existing task | `task`, `action`             |
| update | Updates task completion  | `task`, `complete`, `action` |

Example payload to **add** a task:

```json
{
  "task": "Buy groceries",
  "complete": "false",
  "action": "add"
}
```

## 🧠 How It Works

### 🔁 `main()` Flow

```python
def main(self):
    keys = list(self.data)
    if "action" in keys:
    self.complete_action(keys)
    return self.format_items()
```

- If an `action` key exists in the request:

  - It performs the operation (add, update, delete)

- Returns a list of all items in the table

### ⚡ `complete_action()`

Dynamically maps the `action` to the corresponding method:

```python
function_map = {
    "add": self.new_task,
    "delete": self.delete_task,
    "update": self.update_task
}
```

## ⚠️ Configuration Note

Update the following line in `get_table()` with your actual table name:

```python
if 'INPUT TABLE NAME HERE' in table:
```

This should match the name (or partial name) of the DynamoDB table you're using for tasks.

## 🧪 Example Output

After a successful invocation, the response will look like:

```json
{
  "statusCode": 200,
  "items": [
    {
      "task": "Buy groceries",
      "complete": "false"
    },
    {
      "task": "Call mom",
      "complete": "true"
    }
  ]
}
```
---
# ⚛️ React Frontend – Task App with AWS Amplify Auth + API

This document outlines the structure and functionality of the main React components used in the Task App frontend. It includes the `App.js` file, which serves as the core of the user interface, and `AuthHeader.js`, which provides a custom header for the authentication flow using **AWS Amplify**.

## 📄 `App.js`

This is the main component of the Task App. It handles:

- Authentication with **AWS Amplify + Cognito**

- Task management via **API Gateway + Lambda**

- Custom theming using **Amplify UI**

- State and side-effect management with **React Hooks**

### 🔧 Configuration

Update the following constant with your actual API Gateway endpoint:

```js
const API_URL = "YOUR_API_GATEWAY_URL";
```

## 🔑 Features Overview

### 1. Authentication

- Uses Amplify's `<Authenticator />` for login/signup.

- Custom header added via `AuthHeader.js`.

### 2. Theming

- Uses `createTheme()` to apply a custom dark mode style.

- Fully compatible with AWS Amplify UI React components.

### 3. Task State Management

- Tasks are fetched on load via `useEffect()`.

- Actions include:

  - `addTask()` – Adds new task via POST

  - `deleteTask(taskName)` – Deletes task

  - `updateTaskCompletion(taskName, complete)` – Toggles completion state

## ⚙️ Functional Flow

### 🔁 On Load

```js
useEffect(() => {
  fetchTasksFromAPI();
}, []);
```

- Fetches task list from API on initial render.

### ➕ Add Task

```js
addTask();
```

- Triggered by clicking the `Add` button or pressing `Enter`.

- Sends `{ task, complete: "false", action: "add" }` to API.

### 🗑 Delete Task

```js
deleteTask(taskName);
```

- Sends `{ task, complete: "true", action: "delete" }` to API.

### ✅ Update Task Completion

```
updateTaskCompletion(taskName, complete)
```

- Toggles a task’s `complete` status.

- Sends `{ task, complete, action: "update" }`.

### 👋 Sign Out

```js
<button onClick={signOut}>Sign Out</button>
```

## 🖼️ AuthHeader.js

Provides a custom login header inside the Amplify Authenticator component.

```js
<img src="/logo192.png" alt="React" />
<h2>Mike's Task Login Page</h2>
```

- Styling uses inline styles.

- Custom branding for the login experience.

## 🧪 Sample App Output

```json
{
  "statusCode": 200,
  "items": [
    {
      "task": "Read docs",
      "complete": "false"
    },
    {
      "task": "Push to GitHub",
      "complete": "true"
    }
  ]
}
```

## ✅ Summary

The React frontend is tightly integrated with Amplify for:

- Secure authentication

- Real-time task management

- Seamless deployment via Amplify Hosting

This setup is ideal for learning or building production-ready serverless React apps.
