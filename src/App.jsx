import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'

// Proj specific
import { colors } from './components/ColorDefs'
import Header from './components/Header'
import SearchView from './components/SearchView'
import FavCollection from './components/FavCollection'
import PicturePopup from './components/PicturePopup'
import WarningPopup from './components/WarningPopup'

// Google fonts typeface
import 'typeface-montserrat'

injectGlobal`
	* {
		margin: 0;
	}
	html {
		margin: 0;
		overflow-x: hidden;
		overflow-y: hidden;
	}
	body {
		margin: 0;
		overflow-x: hidden;
		overflow-y: hidden;
		font-family: 'Montserrat';
		background: #ede2f6;
	}
	h1 {
		font-size: 18px;
	}
	h2 {
	  font-size: 16px;
	  line-height: 22px;
	  font-weight: 400;
	}
	button {
		align-self: flex-start;
		display: inline-block;
		margin: 0 auto;
		font-size: 12px;
		color: ${colors.lightGrey};
		text-decoration: none;
		background-color: black;
		
		&:link,
		&:visited {
			color: ${colors.lightGrey};
		}
		&:hover {
			color: ${colors.lightGreen};
			text-decoration: none;
		}
		&:active {
			color: ${colors.lightGrey};
		}
		&:focus {
			outline: 0;
		}
	}
	a {
		color: ${colors.lightGrey};
		text-decoration: none;
		
		&:link,
		&:visited {
			color: ${colors.lightGrey};
		}
		&:hover {
			color: ${colors.lightGreen};
			text-decoration: none;
		}
		&:active {
			color: ${colors.lightGrey};
		}
		&:focus {
			outline: 0;
		}
	}
`

const headHt = 73
let footHt = 100

// Mobile Safari? Add height to compensate for browswer's bottom tray overlaying content.
// You need to actually use a phone to expose Safari's bottom tray behavior (web dev headache across the globe).
// desktop phone emulators don't expose issue, they don't include tray.
const userAgent = window.navigator.userAgent;
if ((userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) && userAgent.indexOf("CriOS")===-1) {
	footHt += 78
}
const combinedHt = headHt + footHt

const MainCol = styled('div')`
	padding-left: 0;
	padding-right: 0;
`

// Establish heights for three main layout rows
const HeadWrapper = styled('header')`
	position: relative;
	height: ${headHt}px;
`
const MainWrapper = styled('main')`
  height: calc(100vh - ${combinedHt}px);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`
const FavCollectionWrapper = styled('footer')`
	position: relative;
	height: ${footHt}px;
`

class App extends Component {

	constructor(props) {
		super(props)

		const localStorageData = this.checkLocalStorage()

		this.state = {
			popItemData: null,
			favCollection: localStorageData ? localStorageData : {},
			displayWarning: false
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.onFavBtnSelect = this.onFavBtnSelect.bind(this)
		this.onPictureSelect = this.onPictureSelect.bind(this)
		this.onPopCloseSelect = this.onPopCloseSelect.bind(this)
		this.onTrashSelect = this.onTrashSelect.bind(this)
		this.onConfirmSelect = this.onConfirmSelect.bind(this)
		this.deleteCollection = this.deleteCollection.bind(this)
		this.onWarningCloseSelect = this.onWarningCloseSelect.bind(this)
	}

	checkLocalStorage() {
		try {
			return JSON.parse(localStorage.getItem("fantastic-flowing-film-files-ala-giphy"))
		} catch (e) {
			console.log("localStorage fetch failure")
			return null
		}
	}

	writeToLocalStorage(obj) {
		try {
			localStorage.setItem("fantastic-flowing-film-files-ala-giphy", JSON.stringify(obj))
		} catch (e) {
			console.log("localStorage write failure")
		}
	}

	handleFormSubmit(e) {
		this.searchComp.handleFormSubmit(e)
	}

	onFavBtnSelect(e, data) {
		e.stopPropagation()

		// Toggle add/remove of gif
		const favCollection = { ...this.state.favCollection }
		if (favCollection.hasOwnProperty(data.id)) {
			delete favCollection[data.id]
		} else {
			favCollection[data.id] = data
			// Ensures when user scrolls strip, then adds new gif, they will see gif added to beginning (scrolls to beginning of collection)
			this.favComp.resetImageStrip()
		}
		this.writeToLocalStorage(favCollection)
		this.setState({ favCollection })
	}

	onPictureSelect(data) {
		this.setState({
			popItemData: data
		})
	}

	onPopCloseSelect() {
		this.setState({
			popItemData: null
		})
	}

	onTrashSelect() {
		this.setState({
			displayWarning: true
		})
	}

	onConfirmSelect() {
		this.deleteCollection()
		this.setState({
			displayWarning: false
		})
	}

	deleteCollection() {
		this.writeToLocalStorage({})
		this.setState({ favCollection: null })
	}

	onWarningCloseSelect() {
		this.setState({
			displayWarning: false
		})
	}

	render() {
		return (
			<div className="container">
				<div className="row">

					<MainCol className="col">

						<Helmet>
							<meta charSet="utf-8" />
							<title>ANIMATED GIF SELECTOR</title>
						</Helmet>

						<HeadWrapper>
							<Header handleFormSubmit={this.handleFormSubmit} />
						</HeadWrapper>

						<MainWrapper className="middle">
							<SearchView
								ref={comp => this.searchComp = comp}
								onPictureSelect={this.onPictureSelect}
								favCollection={this.state.favCollection}
								onFavBtnSelect={this.onFavBtnSelect}
								combinedHt={combinedHt}
							/>
						</MainWrapper>

						<FavCollectionWrapper>
							<FavCollection
								ref={comp => this.favComp = comp}
								favCollection={this.state.favCollection}
								onPictureSelect={this.onPictureSelect}
								onTrashSelect={this.onTrashSelect}
							/>
						</FavCollectionWrapper>

						{this.state.popItemData &&
							<PicturePopup
								data={this.state.popItemData}
								onPopCloseSelect={this.onPopCloseSelect}
								favCollection={this.state.favCollection}
								onFavBtnSelect={this.onFavBtnSelect}
							/>}
						{this.state.displayWarning &&
							<WarningPopup
								onWarningCloseSelect={this.onWarningCloseSelect}
								onConfirmSelect={this.onConfirmSelect}
							/>}
					</MainCol>
				</div>
			</div>
		)
	}
}

export default App


