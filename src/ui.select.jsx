import React, { Component } from 'react';
import './ui.select.css';

class UISelect extends Component {
    constructor(props) {
        super();
        this.toggleSelect = this.toggleSelect.bind(this);
        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.setSelectedOption = this.setSelectedOption.bind(this);
        this.focusOnOption = this.focusOnOption.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.mouseClickOnOption = this.mouseClickOnOption.bind(this);
        this.closeSelect = this.closeSelect.bind(this);
        // immutability of the props options
        let newList = JSON.parse(JSON.stringify(props.options));
        this.state = {
            currentIndex: 0,
            scrollPosition: 0,
            selectedName: "",
            open: false,
            selectedOption: { name: "" },
            // copy of the options with added properties for control
            componentOptions: newList.map((obj, idx) => {
                obj.hover = idx == 0 ? true : false;
                obj.selected = false;
                return obj;
            })
        }
    }

    // close select when clicked on body
    // componentWillMount() {
    //     document.addEventListener('mousedown', this.handleClick, false);
    // }

    // componentWillUnmount() {
    //     document.removeEventListener('mousedown', this.handleClick, false);
    // }

    // handleClick = (e) => {
    //     if (this.node.contains(e.target)) {
    //         return;
    //     }
    //     setTimeout(() => {
    //         this.setState({
    //             open: false,
    //         })
    //     }, 200);
    // }

    // open/close select
    toggleSelect(e) {
        this.setState({
            open: !this.state.open,
        });
    }

    closeSelect(e) {
        //let target = e.target;
        setTimeout(() => {
            this.setState({
                open: false,
            });
        }, 200);
        //e.target.focus();
    }

    // on input keypress
    keyPressHandler(e) {
        e = e || window.event;
        let scrollPosition;
        if (e.keyCode == '38' && this.state.open) {
            // up arrow
            if (this.state.currentIndex - 1 > -1) {
                this.setSelectedOption(this.state.currentIndex - 1, false, false);
                this.setScrollingUl(this.ul.querySelector(".hover").previousSibling.offsetTop);
                this.setState({
                    currentIndex: this.state.currentIndex - 1,
                })
            }
        }
        else if (e.keyCode == '40') {
            // down arrow
            if (this.state.open) {
                if (this.state.currentIndex + 1 < this.state.componentOptions.length) {
                    this.setSelectedOption(this.state.currentIndex + 1, false, false)
                    this.setScrollingUl(this.ul.querySelector(".hover").nextSibling.offsetTop);
                    this.setState({
                        currentIndex: this.state.currentIndex + 1,
                    })
                }
            } else {
                this.setState({
                    open: true,

                })
            };
        }
        else if (e.keyCode == '13') {
            // enter
            this.setSelectedOption(this.state.currentIndex, false, true);
            this.toggleSelect();
        }
    }

    // set select scroll position on up/down keys and text search
    setScrollingUl(px) {
        this.setState({
            scrollPosition: px,
        }, () => {
            this.ul.scrollTo(0, this.state.scrollPosition);
        })
    }

    mouseClickOnOption(e) {
        this.setSelectedOption(e.target.dataset.idx, true, true)
    }

    // set the selcted option
    setSelectedOption(idx, isMouse, isPrint) {
        let newOptions = this.state.componentOptions.map((x, i) => {
            if (i == idx) {
                x.selected = true;
                x.hover = true;
            }
            else {
                x.selected = false;
                x.hover = false;
            }
            return x;
        })

        this.setState({
            componentOptions: newOptions,
            selectedName: newOptions[idx].name,
            open: !isMouse,
            currentIndex: idx
        }, () => {
            this.state.componentOptions.filter((item, i) => {
                if (item.selected && isPrint) {
                    console.log(item.name, item.id);
                }
            })
        }
        )
    }

    // mouse hover
    focusOnOption(e) {
        let idx = 0;
        if (typeof e === "object") {
            idx = e.target.dataset.idx;
        }
        else {
            idx = e;
        }
        let newOptions = this.state.componentOptions.map((x, i) => {
            x.hover = (i == idx) ? true : false;
            return x;
        })
        this.setState({
            currentIndex: idx,
            componentOptions: newOptions,
        })
    }

    // input value change handler
    inputChange(e) {
        let occured = false;
        let currentIndex;
        let newOptions = this.state.componentOptions.map((item, i) => {
            if (item.name.indexOf(e.target.value) === 0 && e.target.value.trim() !== "" && !occured) {
                item.hover = true;
                item.selected = false;
                occured = true;
                currentIndex = i;
            }
            else {
                item.hover = false;
                item.selected = false;
            }
            return item;
        })
        this.setState({
            selectedName: e.target.value ? e.target.value : "",
            componentOptions: newOptions,
            open: true,
        })
        if (occured) {
            this.setState({
                currentIndex: currentIndex,
            }, () => {
                if (this.ul.querySelector(".hover")) {
                    this.setScrollingUl(this.ul.querySelector(".hover").offsetTop);
                }
            })
        }
        else {
            if (e.target.value == "")
                this.focusOnOption(0);
        }
        e.target.focus();
    }

    render() {
        return (
            <div
                className={"select-wrapper" + (this.state.open ? " open" : "")}
                ref={node => this.node = node}
            >
                <input
                    // tab support
                    tabIndex="0"
                    className="select-value"
                    onChange={this.inputChange}
                    value={this.state.selectedName}
                    placeholder="בחר"
                    onKeyDown={this.keyPressHandler}
                    onClick={this.toggleSelect}
                    onBlur={this.closeSelect}
                />
                <span className="tooltip"></span>
                <ul className="select-options" ref={ul => this.ul = ul}>
                    {this.state.componentOptions.map((value, idx) =>
                        <li className={"s-option" +
                            (value.hover ? " hover" : " ") +
                            (value.selected ? " selected" : " ")
                        }
                            data-idx={idx}
                            key={value.id}
                            data-id={value.id}
                            onClick={this.mouseClickOnOption}
                            onMouseMove={this.focusOnOption}
                        >
                            {value.name}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

export default UISelect
