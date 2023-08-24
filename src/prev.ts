import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "auto-url-select" is now active!');

  // const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
  //   console.log(event);

  //   const editor = vscode.window.activeTextEditor;
  //   if (!editor) {
  //     console.log("returned");
  //     return;
  //   }

  //   const selectedText = editor.document.getText(editor.selection);
  //   if (selectedText) {
  //     console.log(`Double-clicked text: "${selectedText}"`);
  //     console.log(`Selected range: ${editor.selection}`);
  //   }

  //   if (!editor.selection.isEmpty) {
  //     // Get the selected text
  //     const selectedText = editor.document.getText(editor.selection);
  //     console.log("ere");
  //     console.log(`Selected text: "${selectedText}"`);
  //     console.log(`Selected range: ${editor.selection}`);
  //   }
  // });

  const disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      console.log("Editor not available");
      return;
    }

    if (!editor.selection.isEmpty) {
      const selectedLine = editor.document.lineAt(editor.selection.start.line);
      const selectedText = selectedLine.text.substring(
        editor.selection.start.character,
        editor.selection.end.character
      );

      // const specialCharacters = /[^\w\d\s-]/g;
      const specialCharacters = /['"()\[\]{}<>| ]/g;
      const parts = selectedLine.text.split(specialCharacters);

      const urlRegex = /(https?:\/\/[^<>"\s]+)/g;
      // const matchedUrls = selectedLine.text.match(urlRegex);
      const matchedUrls = parts.filter((part) => urlRegex.test(part));

      if (matchedUrls) {
        console.log("Matched URLs:", matchedUrls);

        const selectedUrl = matchedUrls.find((url) => url.includes(selectedText));

        if (selectedUrl) {
          console.log("Selected : ", selectedUrl);
          const urlStartPosition = selectedLine.text.indexOf(selectedUrl);

          if (urlStartPosition !== -1) {
            const startPosition = new vscode.Position(
              editor.selection.start.line,
              urlStartPosition
            );
            // const startPosition = new vscode.Position(selectedLine.lineNumber, urlStartPosition);
            const endPosition = new vscode.Position(
              selectedLine.lineNumber,
              urlStartPosition + selectedUrl.length
            );
            const newSelection = new vscode.Selection(startPosition, endPosition);
            editor.selection = newSelection;
          }
        }
      }
    }
  });

  context.subscriptions.push(disposable);
}
