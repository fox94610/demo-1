import {Component} from 'react'

export default class ScrollAndResizeEvents extends Component {

	constructor(props) {
		super(props)
		this.resizeTimeout = null
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
		this.actualResizeHandler = this.actualResizeHandler.bind(this)
		this.scrollHandler = this.scrollHandler.bind(this)
	}

	componentDidMount() {
		window.addEventListener("resize", this.windowResizeHandler, false)
		window.addEventListener('scroll', this.scrollHandler, false)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowResizeHandler, false)
		window.removeEventListener('scroll', this.scrollHandler, false)
	}

	windowResizeHandler() {
		const self = this
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(function() {
				self.resizeTimeout = null
				self.actualResizeHandler()
			 // The actualResizeHandler will execute at a rate of 15fps
			 }, 66)
		}
	}

	actualResizeHandler() {
		const docElem = document.documentElement
		const body = document.getElementsByTagName('body')[0]
		let width = window.innerWidth || docElem.clientWidth || body.clientWidth
		let height = window.innerHeight || docElem.clientHeight || body.clientHeight
		//console.log(`window width = ${width}   window height = ${height}`)
		this.props.windowSizeChange({width:width, height:height})
	}

	scrollHandler() {
		let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
		let scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft
		//console.log(`scrollTop = ${scrollTop}   scrollLeft = ${scrollLeft}`)
	}

	render() {
		return false
	}
}