import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from 'react-router-dom';
import ProgressCentered from "../components/ProgressCentered";
import { getUsersAction } from "../actions";
import Grid from "@material-ui/core/Grid";
import UserFormDialog from "../components/UserFormDialog";
import User from "../components/User";
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';

class Users extends React.Component {
  chunkSize = 5;

  state = {
    isLoading: false,
    user: {
      name:'',
      surname: '',
      desc: ''
    },
    errors: {
      name: '',
      surname: '',
      desc: ''
    }
  }

  componentDidMount() {
    this.getUsersPage(this.currentPage);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.page !== prevProps.match.params.page) {
      this.getUsersPage(this.currentPage);
    }
  }

  get currentPage() {
    const { page } = this.props.match.params;
    if (+page) {
      return +page;
    }
    return 0;
  }

  get pageCount() {
    return Math.ceil(this.props.users.length / 5);
  }

  get startSlice() {
    return this.currentPage * this.chunkSize;
  }

  get endSlice() {
    return this.chunkSize + this.startSlice;
  }

  get usersCurrentPage() {
    return this.props.users.slice(this.startSlice, this.endSlice);
  }

  getUsersPage = async (index) => {
    this.setState({
      isLoading: true,
    });
    if (this.props.users.length === 0) {
      await this.props.getUsersAction();
    }
    this.props.history.push(`/page/${index}`);
    this.setState({
      isLoading: false,
    });
  }

  handleChangeInput = (event, propName) => {
    this.setState({
      user: {
        ...this.state.user,
        [propName]: event.target.value,
      }
    });
  }

  nextPage = () => {
    this.props.history.push(`/page/${+this.currentPage + 1}`);
  }

  backPage = () => {
    this.props.history.push(`/page/${+this.currentPage - 1}`);
  }

  userReset = () => {
    this.setState({
      user: {
        name:'',
        surname: '',
        desc: ''
      },
      errors: {
        name: '',
        surname: '',
        desc: ''
      }
    });
  }

  setUser = (user) => {
    this.setState({
      user: {
        name: user.name,
        surname: user.surname,
        desc: user.desc
      }
    });
  }

  handleEditUser = (id) => {
    return fetch(`http://77.120.241.80:8911/api/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        this.state.user,
      ),
    })
      .then((response) => response.json())
      .then(({ errors, ...user }) => {
        if (errors) {
          this.setState({ errors })
          return { errors };
        }
        this.userReset();
        this.props.getUsersAction();
        return user;
      })
  }

  createUser = () => {
    return fetch('http://77.120.241.80:8911/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        this.state.user,
      ),
    })
      .then((response) => response.json())
      .then(({ errors, ...user }) => {
        if (errors) {
          this.setState({ errors })
          return { errors };
        }
        this.userReset();
        this.props.getUsersAction();
        return user;
      })
  };

  handleDeleteUser = async (id) => {
    await fetch(`http://77.120.241.80:8911/api/user/${id}`, {
      method: 'DELETE'
    });
    this.props.getUsersAction();
  }

  render() {
    const { classes } = this.props;

    if (this.state.isLoading) {
      return <ProgressCentered />;
    }

    return (
      <div className={classes.root}>
        <div>
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            {this.usersCurrentPage.map(user => 
              <User
                handleChangeInput={this.handleChangeInput}
                user={user}
                key={user.id}
                setUser={this.setUser}
                handleDeleteUser={this.handleDeleteUser}
                handleEditUser={this.handleEditUser}
                errors={this.state.errors}
                userReset={this.userReset}
              />)}
          </Grid>
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <ButtonGroup
              color="secondary"
              aria-label="large outlined secondary button group"
              className={classes.pagination}
            >
              <Button
               onClick={this.backPage}
               disabled={this.currentPage === 0}>
                Назад
              </Button>
              {new Array(this.pageCount)
                .fill(null)
                .map((value, index) => (
                  <Button
                    onClick={() => this.getUsersPage(index)}
                    style={{ backgroundColor: (this.currentPage === index) ? 'blue' : '' }}
                    key={index}
                    value={index}
                  >
                    {index + 1}
                  </Button>
              ))}
              <Button 
                onClick={this.nextPage} 
                disabled={this.currentPage + 1 === this.pageCount}>
                Вперед
              </Button>
            </ButtonGroup>
          </Grid>
        </div>
        <UserFormDialog
          handleChangeInput={this.handleChangeInput}
          createUser={this.createUser}
          errors={this.state.errors}
          userReset={this.userReset}
          getUsersAction={this.props.getUsersAction}
        />
      </div>
    );
  }
}

const useStylesForm = withStyles((theme) =>  ({
  button: {
    width: "350px",
    height: "70px",
    margin: "30px auto",
    backgroundColor: "#a3339e",
    color: "#ffffff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#a3339e"
    }
  },
  root: {
    backgroundColor: "#f5f5f5"
  },
  error: {
    minHeight: "60vh"
  },
  pagination: {
    margin: "25px"
  }
}))(Users);

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  async getUsersAction() {
    const usersActionsResult = getUsersAction();
    dispatch(usersActionsResult);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(useStylesForm));
