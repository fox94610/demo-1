import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'
import { colors } from './components/ColorDefs'

// App comprised of three rows
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
// You need to actually use a phone to expose Safari's bottom tray behavior (web dev headache that spans the globe).
// desktop phone emulators don't expose this issue becasue they don't include the tray.
const userAgent = window.navigator.userAgent;
if ((userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) && userAgent.indexOf("CriOS")===-1) {
	footHt += 78
}
const combinedHt = headHt + footHt

// Establish three main row heights immediately
const Top = styled('header')`
	height: ${headHt}px;
	box-shadow: 0px 4px 27px -1px rgba(0,0,0,0.68);
`
const Middle = styled('main')`
  height: calc(100vh - ${combinedHt}px);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`
const Bottom = styled('footer')`
	height: ${footHt}px;
	box-shadow: 0px -4px 27px -1px rgba(0,0,0,0.9);
`
const MainCol = styled('div')`
	padding-left: 0;
	padding-right: 0;
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
		this.online = true // Toggle to test/force edge cases
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
		const favCollection = { ...this.state.favCollection }
		if (favCollection.hasOwnProperty(data.id)) {
			delete favCollection[data.id]
		} else {
			favCollection[data.id] = data
			// If user has scrolled the strip around, without this action
			// it's not apparent the new gif was added
			this.favComp.resetFilmstrip()
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
		this.writeToLocalStorage(this.state.favCollection)
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
							<title>FANTASTIC FLOWING "FILM" FILES</title>
						</Helmet>
						<Top>
							<Header handleFormSubmit={this.handleFormSubmit} />
						</Top>
						<Middle>
							<SearchView
								ref={comp => this.searchComp = comp}
								onPictureSelect={this.onPictureSelect}
								favCollection={this.state.favCollection}
								onFavBtnSelect={this.onFavBtnSelect}
								online={this.online}
							/>
						</Middle>
						<Bottom>
							<FavCollection
								ref={comp => this.favComp = comp}
								favCollection={this.state.favCollection}
								onPictureSelect={this.onPictureSelect}
								onTrashSelect={this.onTrashSelect}
								online={this.online}
							/>
						</Bottom>
						{this.state.popItemData &&
							<PicturePopup
								data={this.state.popItemData}
								onPopCloseSelect={this.onPopCloseSelect}
								favCollection={this.state.favCollection}
								onFavBtnSelect={this.onFavBtnSelect}
								online={this.online}
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
