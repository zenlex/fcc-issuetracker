# Issue Tracker API
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

*Project for Free Code Camp Quality Assurance and Advanced Node/Express certification - spec [here](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)*  

### Table of Contents
  - [Install](#install)
  - [Usage](#usage)
  - [Extra Sections](#extra-sections)
  - [API](#api)
  - [Maintainers](#maintainers)
  - [Thanks](#thanks)
  - [Contributing](#contributing)
  - [License](#license)
- [Definitions](#definitions)

### Install
**Status:** Required by default, optional for [documentation repositories](#definitions).
- Fork/Clone repo
- Run `npm install` to install dependencies 
- Run `npm test` to run unit and integration tests (Jest)
- If `NODE_ENV=test` the test runner should also run the Free Code Camp automated tests against the project spec (FCC tests not included in repo)

### Usage
Use forms in `/views` or generate requests to api endpoints to create, read, update, and delete issues.

### API
`GET /api/issues/{project}` - retrieve all issues for {project}

`POST /api/issues/{project}` - create new issue in {project}
Required fields:
  - issue_title
  - issue_text
  - created_by

`PUT /api/issues/{project}` - update existing issue
Required fields:
  - _id
  - {fields to update}
 
 `DELETE /api/issues/{project}` - delete existing issue
 Required fields:
 - _id

### Contributing
Not accepting PRs at this time. For questions, contact erich@zenlex.dev

### License
[GNU General Public License](https://opensource.org/licenses/GPL-3.0)

