# Java Auto Grader

Java Auto Grader is a tool that reads data from Google Classroom and automatically runs all students Java files against testcases.

## Setup

> Make sure you've installed [`Node JS`](https://nodejs.org/en)

To use Java Auto Grader, clone the repo and run these commands:

``` bash
npm install
npm run dev
```

Open the link at [localhost:5173](localhost:5173) and input a class and an assignment.

## Features

When you are at the dashboard, you have a few options as to what to do, each in the top left corner:

* Edit Testcases (Flash Icon) - Here you can add text files that will be added alongside the students Java files. Your students can access these through `new File("textfile.txt")`
* Run all Java files (Play Icon) - Runs every Java file and checks it against the test case.
* Rerun Java file (Reload Icon) - Reruns the current Java file. You can make quick edits in the editor then rerun the submission.
* Sign Out (Exit Icon) - Signs out of the Google Account you're currently signed into. To pick a different assignment, reload the page.
