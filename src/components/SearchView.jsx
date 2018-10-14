import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import styled from 'react-emotion'
import $ from 'jquery'
import ItemRect from '../components/ItemRect'


const Wrapper = styled('div')`
  height: 100%;
`
// override bootstraps 15px padding
const ReturnedItems = styled('section')`
  padding: 0 10px 10px 10px;
`
// override bootstraps -15px margins
const ItemRow = styled('div')`
	margin-left: -5px;
	margin-right: -5px;
`
// opacity toggle to avoid FOUT, switch on componentDidUpdate
const loadMore = css`
	opacity: 0;
	text-align: center;
	margin: 20px 0;
		> button {
			padding: 7px 17px 6px;
			margin: 0 auto;
		}
`
export default class SearchView extends Component {

	constructor(props) {
		super(props)
		this.state = {
			giphyData: []
		}
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.callGiphyAPI = this.callGiphyAPI.bind(this)
		this.searchString = null
		this.searchOffset = 0
	}

	componentDidUpdate() {
		if (this.state.giphyData.length > 0) {
			setTimeout(()=>{
				$('.btn-row').css('opacity','1')
			}, 500)
		}
	}

	handleFormSubmit(e) {
		e.preventDefault()
		this.searchString = $(".search-input").get(0).value;
		this.callGiphyAPI();
	}

	callGiphyAPI(loadMoreAction) {
		let self = this

		if (loadMoreAction) {
			this.searchOffset += 25
		} else {
			// Form submit, alway fresh pull of first 25 items
			this.searchOffset = 0
			this.setState({
				giphyData: []
			})
		}

		let apiGetRequest = $.get(`https://api.giphy.com/v1/gifs/search?api_key=UxmV6ja022M8qVJzzcoWd1T8YOF3ZP2w&q=${this.searchString}&offset=${this.searchOffset}`)
		apiGetRequest.done(function(resp) {
			let copyFromState = [...self.state.giphyData]
			let finalData = [...copyFromState, ...resp.data]
			self.setState({
				giphyData: finalData
			})
		})
	}

	render() {
		return (
			<Wrapper>
				<ReturnedItems className="container">
					{ this.state.giphyData.length > 0 && (
						<Fragment>
							<ItemRow className="row">
							{	this.state.giphyData.map((obj, index) =>
									<ItemRect
										data={obj}
										index={index}
										onPictureSelect={this.props.onPictureSelect}
										onFavBtnSelect={this.props.onFavBtnSelect}
										favCollection={this.props.favCollection}
										searchOffset={this.searchOffset}
										key={obj.id}
									/>
								)}
							</ItemRow>
							<ItemRow className={"row btn-row "+loadMore}>
								<button onClick={this.callGiphyAPI}>LOAD MORE</button>
							</ItemRow>
						</Fragment>
					)}

				</ReturnedItems>
			</Wrapper>
		)
	}
}

SearchView.propTypes = {
	onPictureSelect: PropTypes.func,
	favCollection: PropTypes.object,
	onFavBtnSelect: PropTypes.func
}
