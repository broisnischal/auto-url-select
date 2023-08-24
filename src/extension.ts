import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
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
        // const selectedUrl = matchedUrls.find((url) => url.includes(selectedText));

        const cursorPosition = editor.selection.start.character;

        const selectedUrl = matchedUrls.find((url) => {
          const urlStartPosition = selectedLine.text.indexOf(url);
          const urlEndPosition = urlStartPosition + url.length;
          return cursorPosition >= urlStartPosition && cursorPosition <= urlEndPosition;
        });

        if (selectedUrl) {
          const urlStartPosition = selectedLine.text.indexOf(selectedUrl);

          if (urlStartPosition !== -1) {
            const startPosition = new vscode.Position(
              editor.selection.start.line,
              selectedLine.range.start.character + urlStartPosition
            );
            // const startPosition = new vscode.Position(selectedLine.lineNumber, urlStartPosition);
            const endPosition = new vscode.Position(
              editor.selection.start.line,
              selectedLine.range.start.character + urlStartPosition + selectedUrl.length
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
