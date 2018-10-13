import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import $ from 'jquery'

const BackgroundTint = styled('div')`
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: black;
	opacity: .6;
`
const CloseBtn = styled('button')`
	position: absolute;
	width: 32px;
	height: 32px;
	right: 18px;
	top: 18px;
	border: 0;
	padding: 0;
	background: none;
`
const Box = styled('div')`
	position: fixed;
	z-index: 2;
	top: 17px;
	left: 17px;
	right: 17px;
	bottom: 17px;
	background-color: white;
	text-align: center;
	padding: 10px 10px 10px;
	@media (min-width: 576px) {
		top: 5%;
		bottom: 5%;
		left: 50%;
		width: 70%;
		max-width: 800px;
		transform: translate(-50%);
		padding: 0 40px;
	}
`
// negative margin to compensate for title and button heights
const Layout = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	margin-top: -26px;
`
const Figure = styled('figure')`
	position: relative;
	margin: 0;
	height: 70%;
`
const Figcaption = styled('figcaption')`
	line-height: 18px;
	font-weight: 500;
	padding-top: 10px;
	@media (min-width: 576px) {
    margin: 0 auto;
  }
`
const Options = styled('div')`
	font-size: 12px;
	margin-top: 9px;
		> button {
			inline-block
			font-weight: 700;
			background-color: black;
			padding: 3px 8px;
			margin: 0 6px;
		}
`

export default class PicturePopup extends Component {

	constructor(props) {
		super(props)
		this.resizeTimeout = null
		this.windowResizeHandler = this.windowResizeHandler.bind(this)
		this.setFigureLayout = this.setFigureLayout.bind(this)

		this.pictureUrl = this.props.online
					? this.props.data.images.fixed_width.url
					: `./offline/200w_d(${this.props.data.index}).gif`
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowResizeHandler, false)
	}

	componentDidMount() {
		window.addEventListener("resize", this.windowResizeHandler, false)
  	this.setFigureLayout()
	}

	// Tried using css only: background img, object-fit: contain; max-width/height etc. but caused bugs w/ title and btn positioning
	// Forced into using JS but it worked better than all of the above
	// Now handles the worst of worst case scenarios that result from unknown window, image and popup dimensions
	setFigureLayout() {

		// Get constrained picture wi/ht
		let originalW = this.props.data.images.fixed_width.width
		let originalH = this.props.data.images.fixed_width.height
		let containerW = $('.figure').width()
		let containerH = $('.figure').height()
    let picWi = Math.round((originalW * containerH) / originalH)
    let picHt = Math.round((containerW * originalH) / originalW)

    if (picHt < containerH) {
    	// Restricted by left/right
    	$('.gif').height(picHt);
    	$('.gif').width(containerW);
    	// Center picture vertically
			let pushToCenter = (containerH - picHt) * 0.5
			$('.gif').css('margin-top', pushToCenter+'px')
    } else {
    	// Restricted by top/bottom
			$('.gif').width(picWi);
			$('.gif').height(containerH);
    }
	}

	windowResizeHandler() {
		const self = this
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(function() {
				self.resizeTimeout = null
				self.setFigureLayout()
			 // execute at a rate of 15fps
			 }, 66)
		}
	}

  render() {

		// Previously favorited
		let hasBeenFaved = false
		if (this.props.favCollection) {
			hasBeenFaved = this.props.favCollection.hasOwnProperty(this.props.data.id)
		}

    return (
			<Fragment>
				<BackgroundTint onClick={this.props.onPopCloseSelect}/>
				<Box>
					<Layout>
						<Figure className="figure">
							<img className="gif" src={this.pictureUrl} alt={this.props.data.title} />
							<Figcaption className="figcaption">{this.props.data.title.toUpperCase()}</Figcaption>
							<Options className="options">
								<button onClick={(e)=>this.props.onFavBtnSelect(e, this.props.data)}>{hasBeenFaved ? `REMOVE FAVORITE` : `ADD FAVORITE`}</button>
								<button><a href={this.props.data.bitly_url} target="_blank" rel="noopener noreferrer">SEE ON GIPHY</a></button>
							</Options>
						</Figure>
					</Layout>

					<CloseBtn onClick={this.props.onPopCloseSelect}>
						<img src={require('../assets/img/close-btn.svg')} alt="Close button" />
					</CloseBtn>
				</Box>
			</Fragment>
    )
  }
}

PicturePopup.propTypes = {
  data: PropTypes.object,
  onPopCloseSelect: PropTypes.func,
  favCollection: PropTypes.object,
  onFavBtnSelect: PropTypes.func,
  online: PropTypes.bool
}
