import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { cx, css } from 'emotion'
import styled from 'react-emotion'
import { colors } from '../components/ColorDefs'
import { TweenMax, Power4 } from 'gsap'
const $ = require('jquery')

const Gif = styled('img')`
	width: 100%;
`
// override bootstraps 15px padding
const Picture = styled('picture')`
	margin-top: 10px;
	padding-left: 5px;
	padding-right: 5px;
`
const ImgWrapper = styled('div')`
	height: 100%;
	background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%);
`
const favBtnDiameter = 23
const buttonIndicator = css`
	position: absolute;
	width: ${favBtnDiameter}px;
	height: ${favBtnDiameter}px;
	border-radius: 50%;
	background-color: white;
	border: 1px solid grey;
`
const favDisabled = css`
	background-color: ${colors.lightGreen};
`
// Extend hit area for UX
const InvisButton = styled('button')`
	position: absolute;
	right: 10px;
	bottom: 10px;
	width: calc(${favBtnDiameter}px*2);
	height: calc(${favBtnDiameter}px*2);
	background-color: transparent;
	border: 1px solid transparent;
	border-radius: 0;
`

export default class ItemRect extends Component {

	constructor(props) {
		super(props)
		this.animateIn = this.animateIn.bind(this)
	}

	componentDidMount() {
		this.thisComp = $('.item-rect-'+this.props.index)
		this.thisComp.css('pointer-events', 'none')
		TweenMax.set(this.thisComp, {y:window.innerHeight})
		this.animateIn()
	}

	animateIn() {
		const self = this
		let animeDelay = this.props.index - this.props.searchOffset
		TweenMax.set(this.thisComp, {y:window.innerHeight})
		TweenMax.to(this.thisComp, 0.5, {delay: 0.1+(0.05*(animeDelay+1)), y:0, ease:Power4.easeOut, onComplete:()=>{
			self.thisComp.css('pointer-events', 'auto')
		}})
	}

	render() {

		// Previously favorited
		let hasBeenFaved = false
		if (this.props.favCollection) {
			hasBeenFaved = this.props.favCollection.hasOwnProperty(this.props.data.id)
		}

		return (
			<Picture className={`col-6 col-sm-4 col-lg-3 item-rect-${this.props.index}`}>
				<ImgWrapper onClick={()=>this.props.onPictureSelect(this.props.data)}>
					<Gif src={this.props.data.images.fixed_width.url} alt={this.props.data.title} />
					<InvisButton onClick={(e)=>this.props.onFavBtnSelect(e, this.props.data)}>
						<div className={cx(buttonIndicator,{[favDisabled]:hasBeenFaved})} />
					</InvisButton>
				</ImgWrapper>
			</Picture>
		)
	}
}

ItemRect.propTypes = {
  data: PropTypes.object,
  onPictureSelect: PropTypes.func,
  onFavBtnSelect: PropTypes.func,
  favCollection: PropTypes.object,
  index: PropTypes.number,
  searchOffset: PropTypes.number
}