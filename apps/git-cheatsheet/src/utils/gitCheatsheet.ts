export interface GitCommand {
  command: string;
  description: string;
  example?: string;
}

export interface GitCategory {
  name: string;
  commands: GitCommand[];
}

export const GIT_CHEATSHEET: GitCategory[] = [
  {
    name: 'Setup',
    commands: [
      { command: 'git init', description: 'Initialize a new repository' },
      { command: 'git clone <url>', description: 'Clone a remote repository' },
      {
        command: 'git config --global user.name "<name>"',
        description: 'Set username',
      },
      {
        command: 'git config --global user.email "<email>"',
        description: 'Set email',
      },
    ],
  },
  {
    name: 'Basic',
    commands: [
      { command: 'git status', description: 'Show working tree status' },
      { command: 'git add <file>', description: 'Stage files' },
      { command: 'git add .', description: 'Stage all changes' },
      {
        command: 'git commit -m "<msg>"',
        description: 'Commit staged changes',
      },
      { command: 'git diff', description: 'Show unstaged changes' },
      { command: 'git diff --staged', description: 'Show staged changes' },
    ],
  },
  {
    name: 'Branching',
    commands: [
      { command: 'git branch', description: 'List branches' },
      { command: 'git branch <name>', description: 'Create a branch' },
      { command: 'git checkout <branch>', description: 'Switch to branch' },
      {
        command: 'git checkout -b <branch>',
        description: 'Create and switch to branch',
      },
      {
        command: 'git merge <branch>',
        description: 'Merge branch into current',
      },
      { command: 'git branch -d <branch>', description: 'Delete a branch' },
    ],
  },
  {
    name: 'Remote',
    commands: [
      { command: 'git remote -v', description: 'List remotes' },
      {
        command: 'git remote add <name> <url>',
        description: 'Add remote',
      },
      { command: 'git push', description: 'Push to remote' },
      { command: 'git pull', description: 'Pull from remote' },
      { command: 'git fetch', description: 'Fetch from remote' },
      {
        command: 'git push -u origin <branch>',
        description: 'Push and set upstream',
      },
    ],
  },
  {
    name: 'History',
    commands: [
      { command: 'git log', description: 'Show commit history' },
      { command: 'git log --oneline', description: 'Compact history' },
      { command: 'git log --graph', description: 'Graph history' },
      { command: 'git show <commit>', description: 'Show commit details' },
      {
        command: 'git blame <file>',
        description: 'Show line-by-line authorship',
      },
    ],
  },
  {
    name: 'Undo',
    commands: [
      { command: 'git reset HEAD <file>', description: 'Unstage a file' },
      {
        command: 'git checkout -- <file>',
        description: 'Discard changes',
      },
      { command: 'git revert <commit>', description: 'Revert a commit' },
      {
        command: 'git reset --hard <commit>',
        description: 'Reset to commit (destructive)',
      },
      { command: 'git stash', description: 'Stash changes' },
      { command: 'git stash pop', description: 'Apply stashed changes' },
    ],
  },
];

export function searchCommands(query: string): GitCategory[] {
  if (!query) return GIT_CHEATSHEET;
  const lower = query.toLowerCase();
  return GIT_CHEATSHEET.map((cat) => ({
    ...cat,
    commands: cat.commands.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(lower) || cmd.description.toLowerCase().includes(lower)
    ),
  })).filter((cat) => cat.commands.length > 0);
}
