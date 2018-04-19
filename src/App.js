import React, { Component } from 'react';
import styled from 'styled-components';
import Composer, { Doc, Editor } from '@davidisaaclee/react-composer';

const Container = styled.div`
background-color: #efefef;
`;

const StyledComposer = styled(Composer)`
	max-width: 500px;
	margin: 0 auto;
	padding: 10px;
	height: 100vh;
	background-color: #fff;

	white-space: pre-wrap;
`;

class App extends Component {
	state = {
		doc: Doc.empty,
		editor: Editor.make(null),
	}

  render() {
		return (
			<Container>
				<StyledComposer
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

		</Container>
		);
  }
}

export default App;

