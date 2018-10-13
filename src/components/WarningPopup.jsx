import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

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
	top: 30%;
	bottom: 30%;
	left: 17px;
	right: 17px;
	background-color: white;
	text-align: center;
	padding: 10px 10px 10px;
	@media (min-width: 576px) {
		left: 50%;
		width: 70%;
		max-width: 500px;
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
		> h1 {
			margin: 0 auto;
			width: 90%;
			@media (min-width: 576px) {
				width: 75%;
			}
		}
`
const ConfBtn = styled('button')`
	margin: 10px auto;
	padding: 7px 17px 6px;
`

export default class WarningPopup extends Component {

	constructor(props) {
		super(props)
		this.resizeTimeout = null
		this.windowResizeHandler = this.windowResizeHandler.bind(this)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowResizeHandler, false)
	}

	componentDidMount() {
		window.addEventListener("resize", this.windowResizeHandler, false)
	}

	windowResizeHandler() {
		const self = this
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(function() {
				self.resizeTimeout = null
			 }, 100)
		}
	}

  render() {
    return (
			<Fragment>
				<BackgroundTint onClick={this.props.onWarningCloseSelect}/>
				<Box>
					<Layout>
						<h1>YOU ARE ABOUT TO DELETE YOUR FAVORITES COLLECTION</h1>
						<ConfBtn onClick={this.props.onConfirmSelect}>I'M OK WITH THAT</ConfBtn>
						<CloseBtn onClick={this.props.onWarningCloseSelect}>
							<img src={require('../assets/img/close-btn.svg')} alt="Delete button" />
						</CloseBtn>
					</Layout>
				</Box>
			</Fragment>
    )
  }
}

WarningPopup.propTypes = {
	onWarningCloseSelect: PropTypes.func,
	onConfirmSelect: PropTypes.func
}
