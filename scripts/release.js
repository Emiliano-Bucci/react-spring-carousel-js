import getRepoInfo from 'git-repo-info'
import chalk from 'chalk'

const currentTag = getRepoInfo().tag

const _error = chalk.bgRed
const _success = chalk.bgGreen
const _black = chalk.black

function logError(message) {
  console.log('\n')
  console.error(_error(message))
  console.log('\n')

  process.exit(1)
}

function logSuccess(message) {
  console.log('\n')
  console.error(_success(_black(message)))
  console.log('\n')
}

if (getRepoInfo().branch === 'master') {
  if (currentTag) {
    logSuccess('The branch is tagged correctly')
  }

  if (!currentTag) {
    logError('The branch is not tagged')
  }
}

export {}
