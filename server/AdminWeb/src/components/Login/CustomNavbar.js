import React, {Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
  NavLink
} from 'reactstrap';

class CustomNavbar extends Component{
  state = {
      isOpen: false,
  }
  toggle = () =>{
    this.setState({isOpen: !this.state.isOpen});
  }
  render()
  {
    return (
        <div>
          <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
              <NavbarBrand href="/">ShoppingList</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                      <NavLink href="https://www.google.com/">Link</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        </div>);
}
}
export default CustomNavbar;