import {expect, test} from '@oclif/test'

describe('group/lwc', () => {
  test
  .stdout()
  .command(['group/lwc'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['group/lwc', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
