import React, { Component } from 'react';
import styled from 'styled-components';
import Composer, { Doc, Editor, Edit, DocSelection, Content } from '@davidisaaclee/react-composer';

const Container = styled.div`
	background-color: #efefef;
`;

const StyledComposer = styled(Composer)`
	max-width: 500px;
	margin: 0 auto;
	padding: 60px;
	height: 100vh;
	background-color: #fff;

	white-space: pre-wrap;

	font-family: sans-serif;

	:focus {
		outline: none;
	}

	/* HACK: When the document is empty, the user is directly editing
	 * the container <div>. Once the user starts typing, a <p> is added,
	 * pushing the cursor down due to its default vertical margin.
	 * Removing the top margin of the first paragraph will keep the cursor
	 * from jumping.
	 */
	> p:first-child {
		margin-top: 0;
	}
`;

const Toolbar = ({
	isBold, isItalic, isLink, canAddLink,
	onToggleBold, onToggleItalic, onAddLink, onRemoveLink,
	...restProps
}) => (
	<div {...restProps}>
		<label>
			<span>Bold</span>
			<input
				type="checkbox"
				checked={isBold}
				onClick={onToggleBold}
			/>
		</label>
		<label>
			<span>Italic</span>
			<input
				type="checkbox"
				checked={isItalic}
				onClick={onToggleItalic}
			/>
		</label>
		<label>
			<span>Link</span>
			<button disabled={!canAddLink} onClick={onAddLink}>
				Add
			</button>
			<button disabled={!isLink} onClick={onRemoveLink}>
				Remove
			</button>
		</label>
	</div>
);

const StyledToolbar = styled(Toolbar)`
	background-color: rgba(255, 255, 255, 0.5);
	outline: 1px solid #efefef;
	font-family: sans-serif;

	position: fixed;
	left: 20px;
	bottom: 20px;

	display: flex;
	flex-flow: column nowrap;

	label {
		margin: 10px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;

		span {
			margin-right: 2em;
		}

		button {
			margin: 0 4px;
		}
	}
`;

class App extends Component {
	state = {
		doc: Doc.empty,
		editor: Editor.make(null),

		// stylesOverride :: StyleSet
		// To override style for next edit, set this value.
		stylesOverride: null,
	}

	promptForLinkURL(urlCompletion) {
		urlCompletion(window.prompt("Enter the URL for the link"));
	}

  render() {
		let stylesForCurrentSelection =
			this.state.editor.selection == null
			? {}
			: Doc.stylesForSelection(
				this.state.editor.selection,
				this.state.doc);
		if (this.state.stylesOverride != null) {
			stylesForCurrentSelection = {
				...stylesForCurrentSelection,
				...this.state.stylesOverride,
			};
		}

		return (
			<Container>
				<StyledToolbar
					isBold={!!stylesForCurrentSelection.bold}
					isItalic={!!stylesForCurrentSelection.italic}
					isLink={stylesForCurrentSelection.link != null}
					onToggleBold={() => {
						if (this.state.editor.selection == null || DocSelection.isCollapsed(this.state.editor.selection)) {
							this.setState({
								stylesOverride: {
									...stylesForCurrentSelection,
									...(this.state.stylesOverride == null ? {} : this.state.stylesOverride),
									bold: !stylesForCurrentSelection.bold,
								}
							});
						} else {
							this.setState({
								doc: Doc.applyEdit(
									Edit.toggleBold(this.state.editor.selection),
									this.state.doc)
							});
						}
					}}
					onToggleItalic={() => {
						if (this.state.editor.selection == null || DocSelection.isCollapsed(this.state.editor.selection)) {
							this.setState({
								stylesOverride: {
									...stylesForCurrentSelection,
									...(this.state.stylesOverride == null ? {} : this.state.stylesOverride),
									italic: !stylesForCurrentSelection.italic,
								}
							});
						} else {
							this.setState({
								doc: Doc.applyEdit(
									Edit.toggleItalic(this.state.editor.selection),
									this.state.doc)
							});
						}
					}}
					canAddLink={this.state.editor.selection != null && !DocSelection.isCollapsed(this.state.editor.selection)}
					onAddLink={() => {
						this.promptForLinkURL(url => {
							this.setState({
								doc: Doc.applyEdit(
									Edit.addLink(
										this.state.editor.selection,
										url),
									this.state.doc)
							});
						});
					}}
					onRemoveLink={() => {
						this.setState({
							doc: Doc.applyEdit(
								Edit.applyStyles(
									this.state.editor.selection,
									{ link: null }),
								this.state.doc)
						});
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
							stylesOverride: null,
						};
						this.setState(newState);
					}}
					onSelectionChange={selection => this.setState({
						editor: { ...this.state.editor, selection },
						stylesOverride: null
					})}
					onAddLink={completion => {
						this.promptForLinkURL(completion);
					}}
					stylesForReplacingTextAtSelection={(selection, doc) => {
						if (this.state.stylesOverride != null) {
							return this.state.stylesOverride;
						} else {
							return Doc.stylesForSelection(selection, doc);
						}
					}}
				/>

		</Container>
		);
  }
}

export default App;

