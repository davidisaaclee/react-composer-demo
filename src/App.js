import React, { Component } from 'react';
import Composer, { Doc, Editor } from '@davidisaaclee/react-composer';
import './App.css';

class App extends Component {
	state = {
		doc: Doc.empty,
		editor: Editor.make(null),
	}

  render() {
    return (
			<div className="App">
				<Composer
					document={this.state.doc}
					selection={this.state.editor.selection}
					onEdit={edit => {
						const doc = Doc.applyEdit(edit, this.state.doc);
						const newState = {
							doc,
							editor: Editor.applyEdit(
								edit,
								this.state.doc,
								doc,
								this.state.editor),
						};
						this.setState(newState);
					}}
					onSelectionChange={selection => this.setState({
						editor: { ...this.state.editor, selection }
					})}
					onAddLink={callback => {
						callback(window.prompt("Enter the URL for the link"));
					}}
				/>

		</div>
    );
  }
}

export default App;

