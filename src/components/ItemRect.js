import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { cx, css } from 'emotion'
import styled from 'react-emotion'
import { colors } from '../components/ColorDefs'
//import { TweenMax, Power4 } from 'gsap'
const $ = require('jquery')


const Picture = styled('picture')`
	background-color: slategray;
`
// background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%);
const ImgWrapper = styled('div')`

`
const Gif = styled('img')`
	width: 100%;
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

	componentDidMount() {
		this.picture = $('.item-rect-'+this.props.index)
		this.picture.css('display', 'block')
		this.picture.height(this.props.data.images.fixed_width.height)

		//console.log(this.picture.first(), this.picture.first().height())

		this.picture.first().height(this.props.data.images.fixed_width.height)
	}

	render() {

		// Previously favorited
		let hasBeenFaved = false
		if (this.props.favCollection) {
			hasBeenFaved = this.props.favCollection.hasOwnProperty(this.props.data.id)
		}

		return (
			<Picture className={`item-rect-${this.props.index}`}>
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