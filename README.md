[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/SparkEdUAB/SparkEd)

# Sparked-next

This is an actively maintained new version of SparkEd, Your feedback & contributions are greatly appreciated.

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

# Using Docker

Install Docker on your machine, for better performance install [https://orbstack.dev/](https://orbstack.dev/) instead of docker
Build your container: `docker build -t sparked-next .`.
Run your container: `docker run -p 3000:3000 sparked-next`.

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

`yarn run lint`

Before you make commit, make sure that the linting are passing, check with the eslintrc.yml to check the rules.

### Issues

Check [here](https://github.com/olivierjm/sparked-next/issues) for issues, urgent issues that need attention are pinned on top of other issues. feel free to file an issue if you are experiencing a problem or dive in the existing ones to contribute.
