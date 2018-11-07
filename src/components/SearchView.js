import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import $ from 'jquery'
import StackGrid from "react-stack-grid"; // https://github.com/tsuyoshiwada/react-stack-grid
import ItemRect from '../components/ItemRect'

// Utilities
import ScrollAndResizeEvents from '../components/ScrollAndResizeEvents'

  //height: 100%;
const Wrapper = styled('div')`
	position: relative;
  margin-top: 10px;
`
const ReturnedItems = styled('section')`
  padding: 0 10px 10px 10px;
`
const Spinner = styled('div')`
	display: none;
	position: fixed;
	z-index: 3;
	left: 50%;
	transform: translateX(-50%);
	bottom: 100px;
`
export default class SearchView extends Component {

	constructor(props) {
		super(props)
		this.state = {
			giphyData: [],
			showSpinner: false
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.callGiphyAPI = this.callGiphyAPI.bind(this)
		this.searchString = null
		this.searchOffset = 0
		this.windowSizeChange = this.windowSizeChange.bind(this)
		this.getSearchViewHt = this.getSearchViewHt.bind(this)
		this.enableEndOfContentListener = this.enableEndOfContentListener.bind(this)
		this.checkContent = this.checkContent.bind(this)
		this.searchViewHt = this.getSearchViewHt()
		this.callInProgress = false
		this.numberOfBatches = 0
	}

	componentDidMount() {
		this.spinner = document.getElementsByClassName('spinner')[0]
	}

	checkContent() {
		//console.log('.')
		try {
			const estimatedGifHt = 150;
			let stackGridHeight = document.getElementsByClassName('stack-grid')[0].clientHeight
			let threshhold = (stackGridHeight - this.searchViewHt) - estimatedGifHt
			const distance = document.getElementsByClassName('middle')[0].scrollTop

			//console.log('distance = '+distance, "threshhold = "+threshhold, 'this.callInProgress = '+this.callInProgress)
			if (distance > threshhold && !this.callInProgress) {
				//console.log(">>>>>> CROSSED THRESHOLD")
				this.spinner.style.display = 'block'
				this.callInProgress = true
				this.callGiphyAPI(true)
			}
		} catch(e) {}
	}

	getSearchViewHt() {
		let windowHt = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
		return windowHt - this.props.combinedHt;
	}

	windowSizeChange(obj) {
		this.searchViewHt = this.getSearchViewHt()
	}

	enableEndOfContentListener() {
		//console.log("||||||| enableEndOfContentListener() hit")
		this.callInProgress = false
		this.spinner.style.display = 'none'
		if (!this.monitorInterval) {
			//console.log("||||||| restart monitorInterval")
			this.monitorInterval = setInterval(this.checkContent, 500)
		}
	}

	handleFormSubmit(e) {
		e.preventDefault()
		this.searchString = $(".search-input").get(0).value;
		if (this.searchString !== '') {
			this.callGiphyAPI();
		}
	}

	// Rate limit - 10k return per day
	callGiphyAPI(loadMoreAction) {
		const self = this
		if (loadMoreAction) {
			this.searchOffset += 25
		} else {
			// Form submit, alway fresh pull of first 25 items
			this.searchOffset = 0
			this.setState({
				giphyData: []
			})
		}

		//console.log("@@@ ABOUT TO DO A 'GET' REQUEST")
		let apiGetRequest = $.get(`https://api.giphy.com/v1/gifs/search?api_key=UxmV6ja022M8qVJzzcoWd1T8YOF3ZP2w&q=${this.searchString}&offset=${this.searchOffset}`)
		apiGetRequest.done(function(resp) {
			//console.log("@@@ 'GET' DONE @@@")
			let oldData = [...self.state.giphyData]
			let finalData = [...oldData, ...resp.data]
			self.setState({giphyData: finalData})
			self.enableEndOfContentListener()
		})
	}

	render() {
		//console.log("render() called.....")

		// Make sure initial view is completely covered with gifs
		if (this.state.giphyData.length > 0) {
			const self = this;
			setTimeout(function() {
				if ($('.stack-grid').height() < self.props.searchViewHt) {
					self.callGiphyAPI(true);
				}
			}, 500)
		}

		return (
			<Wrapper className="search-view-wrapper">
				<ReturnedItems>
					<StackGrid columnWidth={200} duration={0} className="stack-grid">
						{	this.state.giphyData.map((data, index) =>
							<ItemRect
								data={data}
								index={index}
								onPictureSelect={this.props.onPictureSelect}
								onFavBtnSelect={this.props.onFavBtnSelect}
								favCollection={this.props.favCollection}
								searchOffset={this.searchOffset}
								key={data.id}
							/>
						)}
					</StackGrid>
				</ReturnedItems>
				<Spinner className='spinner'>
					<img src={require('../assets/img/spinner-sml.gif')} alt="Delete button" />
				</Spinner>
				<ScrollAndResizeEvents windowSizeChange={this.windowSizeChange} />
			</Wrapper>
		)
	}
}

SearchView.propTypes = {
	onPictureSelect: PropTypes.func,
	favCollection: PropTypes.object,
	onFavBtnSelect: PropTypes.func
}
