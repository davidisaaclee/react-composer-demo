import React, { Component } from 'react';
import styled from 'styled-components';
import Composer, { Doc, Editor, Edit, DocSelection, Content } from '@davidisaaclee/react-composer';

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

const Toolbar = ({
	isBold, isItalic, isLink,
	onToggleBold, onToggleItalic, onToggleLink,
	...restProps
}) => (
	<div {...restProps}>
		<label>
			Bold
			<input
				type="checkbox"
				checked={isBold}
				onClick={onToggleBold}
			/>
		</label>
		<label>
			Italic
			<input
				type="checkbox"
				checked={isItalic}
				onClick={onToggleItalic}
			/>
		</label>
		<label>
			Link
			<input
				type="checkbox"
				checked={isLink}
				onClick={onToggleLink}
			/>
		</label>
	</div>
);

const StyledToolbar = styled(Toolbar)`
	position: fixed;
	left: 10px;
	bottom: 10px;
`;

class App extends Component {
	state = {
		doc: Doc.empty,
		editor: Editor.make(null),
	}

	promptForLinkURL(urlCompletion) {
		urlCompletion(window.prompt("Enter the URL for the link"));
	}

  render() {
		const stylesForCurrentSelection =
			this.state.editor.selection == null
			? {}
			: Doc.stylesForSelection(
				this.state.editor.selection,
				this.state.doc);

		return (
			<Container>
				<StyledToolbar
					isBold={!!stylesForCurrentSelection.bold}
					isItalic={!!stylesForCurrentSelection.italic}
					isLink={stylesForCurrentSelection.link != null}
					onToggleBold={() => this.setState({
						doc: Doc.applyEdit(
							Edit.toggleBold(this.state.editor.selection),
							this.state.doc)
					})}
					onToggleItalic={() => this.setState({
						doc: Doc.applyEdit(
							Edit.toggleItalic(this.state.editor.selection),
							this.state.doc)
					})}
					onToggleLink={() => {
						if (stylesForCurrentSelection.link == null) {
							this.promptForLinkURL(url => {
								this.setState({
									doc: Doc.applyEdit(
										Edit.addLink(
											this.state.editor.selection,
											url),
										this.state.doc)
								})
							});
						} else {
								this.setState({
									doc: Doc.applyEdit(
										Edit.applyStyles(
											this.state.editor.selection,
											{ link: null }),
										this.state.doc)
								})
						}
					}}
				/>
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
					onAddLink={completion => {
						this.promptForLinkURL(completion);
					}}
				/>

		</Container>
		);
  }
}

export default App;

