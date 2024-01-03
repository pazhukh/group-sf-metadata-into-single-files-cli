import {expect, test} from '@oclif/test'

describe('group/apex', () => {
  test
  .stdout()
  .command(['group/apex'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['group/apex', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
