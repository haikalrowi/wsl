const vscode = require("vscode");
const packageJson = require("./package.json");

function activate(/** @type {import('vscode').ExtensionContext} */ context) {
  for (const item of packageJson.contributes.commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(item.command, () => {
        const task = new vscode.Task(
          {
            type: "shell",
            command: item.command,
          },
          vscode.TaskScope.Global,
          item.command,
          packageJson.name,
          new vscode.ShellExecution(item.program, item.args, {
            cwd: "${fileWorkspaceFolder}",
          }),
        );
        vscode.tasks.executeTask(task);
      }),
    );
  }
  vscode.window.setStatusBarMessage(`$(sync~spin) $(loading~spin)`, 13000);
}

module.exports = { activate };
