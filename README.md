# random-dml

A Node.js script that randomly executes DML statement.

## Setup

Fill in `config/default.json`

```
{
    // Required
    "db": {
        "client": "",
        "host": "",
        "port": 3306,
        "user": "",
        "password": "",
        "database": "",
        "table": ""
    },
    // Optional
    "number": {
        "insert": 100,
        "update": 100,
        "delete": 100,
        "random": {
            "initial": 100,
            "dml": 20
        }
    }
}
```

## Quick Run

-   Perform a random DML:

    ```
    npm start
    ```

-   Perform a batch insert:

    ```
    npm run -o insert
    ```

-   Perform a batch update:

    ```
    npm run -o update
    ```

-   Perform a batch delete:
    ```
    npm run -o delete
    ```

## Testing

To start unit testing:

```
npm test
```
