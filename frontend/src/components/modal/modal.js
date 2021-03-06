import React from "react";
import { closeModal, openModal } from "../../actions/modal_actions";
import { connect } from "react-redux";
import ArtistLoginContainer from "../session/artist_login_container";
import ArtistSignupContainer from "../session/artist_signup_container";
import UserLoginContainer from "../session/user_login_container";
import UserSignupContainer from "../session/user_signup_container";
import TutorialContainer from "../tutorial/tutorial_container";

function Modal({ modal, closeModal, loggedIn, openModal }) {

  if (!modal) {
    return null;
  }
  let component;
  switch (modal) {
    case "artistSignup":
      component = (
        <ArtistSignupContainer
          loggedIn={loggedIn}
          closeModal={closeModal}
          openModal={openModal}
        />
      )
      break;
    case "artistLogin":
      component = (
        <ArtistLoginContainer
          loggedIn={loggedIn}
          closeModal={closeModal}
          openModal={openModal}
        />
      )
      break;
    case "userSignup":
      component = (
        <UserSignupContainer
          loggedIn={loggedIn}
          closeModal={closeModal}
          openModal={openModal}
        />
      )
      break;
    case "userLogin":
      component = (
        <UserLoginContainer
          loggedIn={loggedIn}
          closeModal={closeModal}
          openModal={openModal}
        />
      )
      break;
    case "tutorial":
      component = (
        <TutorialContainer/>
      )
      break;
    default:
      return null;
  }

  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    modal: state.ui.modal,
    loggedIn: state.session.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(closeModal()),
    openModal: (modal) => dispatch(openModal(modal)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
