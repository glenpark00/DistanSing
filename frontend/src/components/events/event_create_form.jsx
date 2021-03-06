import React from 'react'
import ImageUpload from '../image_upload/image_upload';
import TimePicker from 'react-time-picker';
import 'react-clock/dist/Clock.css';
import CurrencyInput from 'react-currency-input';

export default class EventCreateForm extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let time = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    this.state = {
      name: "",
      description: "",
      price: "0.00",
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      year: new Date().getFullYear(),
      time: time,
      imageurl: this.props.artist ? this.props.artist.imageurl : null,
      imagefile: null
    }

    this.getDays = this.getDays.bind(this);

    this.MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.DAYS = this.getDays();
    this.YEARS = [...Array(5).keys()].map(num => num + parseInt(date.getFullYear()));
    this.handleInput = this.handleInput.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setImageFile = this.setImageFile.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
  }

  componentDidMount() {
    if (!this.props.artist && this.props.loggedInArtist) {
      this.props.fetchArtist(this.props.loggedInArtist.id)
        .then(() => this.setState({ imageurl: this.props.artist.imageurl }))
      return;
    }
    if (!this.props.artist) {
      this.props.history.push('/');
    }
  }

  handleInput(type) {
    this.DAYS = this.getDays();
    return e => this.setState({ [type]: e.target.value });
  }

  setImageFile(imagefile) {
    this.setState({ imagefile })
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = this.prepareForm();
    this.props.createEvent(data)
      .then(event => {
        if (event.event.data._id) {
          this.props.history.push(`/events/${event.event.data._id}`)
        }
      })
      .catch(err => err)
  }

  prepareForm() {
    const formData = new FormData();
    let { name, description, price, day, month, year, time, imagefile } = this.state;
    let date = new Date(this.formatDate(month, day, year) + "T" + this.formatTime(time).toString());
    price = parseFloat(price.replace("$", ""));
    if (imagefile) formData.append("imagefile", imagefile);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("date", date);
    return formData;
  }

  handleCancel() {
    this.props.history.goBack();
  }

  handleDate() {
    return date => this.setState({ date })
  }

  handleTime() {
    return time => this.setState({ time })
  }

  handlePrice() {
    return price => this.setState({ price })
  }

  getDays() {
    let mo = parseInt(this.state.month);
    if (mo === 2 && this.state.year % 4 === 0) {
      return [...Array(29).keys()].map(num => num + 1)
    } else if (mo === 2) {
      return [...Array(28).keys()].map(num => num + 1)
    } else if (mo === 4 || mo === 6 || mo === 9 || mo === 11) {
      return [...Array(30).keys()].map(num => num + 1)
    } else {
      return [...Array(31).keys()].map(num => num + 1)
    }
  }

  formatDate(month, day, year) {
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return [year, month, day].join('-');
  }

  formatTime(time) {
    let [hours, minutes] = time.split(':'); 
    if (hours.length > 2) hours = hours[0] + hours[1];
    if (hours.length < 2) hours = hours = '0' + hours;
    return [hours, minutes].join(':');
  }

  renderErrors() {
    return this.props.errors[0] ? (
      <ul className="event-create-errors">
        {this.props.errors.map((error, idx) => {
          return (
            <li
              key={idx}>
              {error}
            </li>
          )
        })}
      </ul>
    ) : null;
  }

  render() {
    const { name, month, day, year, description, price, time, imageurl } = this.state;
    const ErrorList = this.renderErrors();
    if (!this.props.artist) return null;
    return (
      <div className="event-create-page">
        <div
          className="background-test-form"
          style={{
            backgroundImage: `url("https://distansing-dev.s3-us-west-1.amazonaws.com/big-crowd.jpg")`
          }}
        >

          <div className="background-test-form-filter">


          <form className="event-create-form" onSubmit={this.handleSubmit}>
            <h1 className="event-create-header">Your fans are waiting...</h1>
            <div className="event-create-container">
              <div className="event-create-left">
                <ImageUpload 
                  setImageFile={this.setImageFile} 
                  imageurl={imageurl} 
                  classNames={["image-upload-container", "image-upload", "image-upload-btn"]}
                />
                <div className="image-disclaimer">If no image is uploaded, this<br/>will default to your artist image</div>
              </div>
              <div className="event-create-right">
                <div className="event-inputs-container">
                  <input className="event-name-field" type="text" value={name} onChange={this.handleInput("name")} placeholder="Event Name" />
                  <div className="event-price-container">
                    <div className="event-price-label">Price:</div>
                    <CurrencyInput className="event-price-field" onChange={this.handlePrice()} value={price} prefix="$"/>
                  </div>
                </div>
                <div className="event-date">
                  <select defaultValue={month} onChange={this.handleInput("month")}>
                    {/* <option disabled value="Month">Month</option> */}
                    {this.MONTHS.map((month, idx) =>
                      <option key={idx} value={idx+1}>{month}</option>
                    )}
                  </select>
                  <select defaultValue={day} onChange={this.handleInput("day")}>
                    {/* <option disabled value="Day">Day</option> */}
                    {this.DAYS.map((day, idx) =>
                      <option key={idx} value={day}>{day}</option>
                    )}
                  </select>
                  <select defaultValue={year} onChange={this.handleInput("year")}>
                    {/* <option disabled value="Year">Year</option> */}
                    {this.YEARS.map((year, idx) =>
                      <option key={idx} value={year}>{year}</option>
                    )}
                  </select>
                  <TimePicker className="" value={time} onChange={this.handleTime()} disableClock clearIcon={null} />
                </div>
                <textarea className="event-description-field" value={description} onChange={this.handleInput("description")} placeholder="Tell your fans about the event" />
                {ErrorList}
                <div className="event-create-btns">
                  <button className="event-cancel-btn" onClick={this.handleCancel}>Cancel</button>
                  <button className="event-create-btn">Create Event</button>
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    )
  }
}