const { CompositeDisposable } = require('atom')

function notifyGame (endpoint) {
  const url = `http://127.0.0.1:3648${endpoint}`
  return fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        atom.notifications.addError(data.error)
      }
    })
    .catch(err => {
      console.error(err)
      atom.notifications.addError('Could not connect to the game. Make sure you are running it from Defold on this computer.')
    })
}

module.exports = {
  activate (state) {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add(
      'atom-text-editor[data-grammar="source fuior"]',
      'fuior:run-in-game',
      (event) => {
        const editor = atom.workspace.getActiveTextEditor()
        if (!editor) {
          atom.notifications.addError('No fuior file is open')
          return;
        }

        const data = JSON.stringify({
          data: editor.getText(),
          filename: editor.getTitle(),
        })

        notifyGame(`/load_fuior/${Base64.encode(data)}`)
      }
    ))
  },

  deactivate () {
    this.subscriptions.dispose()
  },
}