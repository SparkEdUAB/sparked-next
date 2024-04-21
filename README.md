[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/SparkEdUAB/SparkEd) 

# Sparked-next

> Software for organizing and presenting educational and training content for delivery on most platforms.

The first [version of SparkEd]((https://github.com/SparkEdUAB/SparkEd) was deployed on a server and loaded more than 1,500 resources. It has worked very well in an office setting and was tested with 20 hosts. We plan to deploy the system in a school with more than 600 students.

To get started check out [our wiki](https://github.com/SparkEdUAB/SparkEd/wiki)

[Check here](https://sparkeduab.github.io/sparked-manual/) for the online documentation how to use this project and a small demo here [https://sparkednext.app](https://sparkednext.app) accessible on big screens.

**Note**: We only support Node^18  

# For Contributors

> Read the Code of Conduct [here](https://github.com/olivierjm/sparked-next/blob/master/CODE_OF_CONDUCT.md)

The project uses the following stack

- **Nextjs** as the overall framework
- **React** as the User Interface library
- **eslint** to lint files
- **MongoDB** as a noSql Database
- **TailwindCSS** for styling

### Development

Clone the repo

`git clone https://github.com/olivierjm/sparked-next.git`  
`cd sparked-next`

Install dependencies

`yarn`

Run the application

`yarn run dev`

### Contribution

Fork this repo

Clone your forked repo

`git clone https://github.com/your-github-username/SparkEd.git`

Add this repo to your remotes as upstream.

`git remote add upstream https://github.com/olivierjm/sparked-next`

Before pushing anything to your fork, always

`git pull upstream master`

> Make sure your commit messages should be clear not vague e.g "Changes and Updates made"  
> Work from a branch other than main whenever possible and branch name should be clear  
> Write clean and transparent code which is easy to maintain  
> When making PRs, give clear descriptions of the changes you made.
> Make sure that all pipelines are passing

### linting

`npm run lint` or `yarn run lint`

Before you make commit, make sure that the linting are passing, check with the eslintrc.yml to check the rules.

### Issues

Check [here](https://github.com/olivierjm/sparked-next/issues) for issues, urgent issues that need attention are pinned on top of other issues. feel free to file an issue if you are experiencing a problem or dive in the existing ones to contribute.

