// TODO, handle situation where there are so few initial items returned that
// the app will try to load more gifs anyways to fill the screen
// Use search "frw"

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import $ from 'jquery'
import StackGrid from "react-stack-grid"; // https://github.com/tsuyoshiwada/react-stack-grid
import ItemRect from '../components/ItemRect'

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
      giphyData: []
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.callGiphyAPI = this.callGiphyAPI.bind(this)
    this.searchString = null
    this.searchOffset = 0
    this.getSearchViewHt = this.getSearchViewHt.bind(this)
    this.enableEndOfContentListener = this.enableEndOfContentListener.bind(this)
    this.checkContent = this.checkContent.bind(this)
    this.searchViewHt = this.getSearchViewHt()
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    this.callInProgress = false

    // For testing (avoid API rate limit)
    //this.calledOnce = false
  }

  componentDidMount() {
    this.spinner = document.getElementsByClassName('spinner')[0]
    window.addEventListener("resize", this.windowResizeHandler, false)
  }

  windowResizeHandler() {
    const self = this
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(function() {
        self.resizeTimeout = null
        self.searchViewHt = self.getSearchViewHt()
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66)
    }
  }

  checkContent() {
    try {
      const estimatedGifHt = 150;
      let stackGridHeight = document.getElementsByClassName('stack-grid')[0].clientHeight
      let threshhold = (stackGridHeight - this.searchViewHt) - estimatedGifHt
      const distance = document.getElementsByClassName('middle')[0].scrollTop
      if (distance > threshhold && !this.callInProgress) {
        this.spinner.style.display = 'block'
        this.callInProgress = true
        this.callGiphyAPI(true)
      }
    } catch(e) {}
  }

  getSearchViewHt() {
    let windowHt = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
    return windowHt - this.props.combinedHt
  }

  enableEndOfContentListener() {
    this.callInProgress = false
    if (!this.monitorInterval) {
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

    // Testing
    //if (this.calledOnce) return
    //this.calledOnce = true

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
      let oldData = [...self.state.giphyData]
      let finalData = [...oldData, ...resp.data]
      self.setState({giphyData: finalData})
      self.spinner.style.display = 'none'

      // Make sure there are potentially more gifs to get before adding listener
      if (resp.data.length >= 25 && resp.data.length !== 0) {
        self.enableEndOfContentListener()
      }
    })
  }

  render() {
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
            { this.state.giphyData.map((data, index) =>
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
          <img src={require('../assets/img/spinner-sml.gif')} alt="load spinner" />
        </Spinner>
      </Wrapper>
    )
  }
}

SearchView.propTypes = {
  onPictureSelect: PropTypes.func,
  favCollection: PropTypes.object,
  onFavBtnSelect: PropTypes.func
}
