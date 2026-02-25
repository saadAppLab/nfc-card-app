// app/page.tsx
'use client'
import Link from 'next/link'
import { AccordionBody, AccordionHeader, AccordionItem, Nav, NavItem, NavLink, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'

export default function HomePage() {
  return (
    <>
      <div className="container text-center" style={{ padding: '80px 0' }}>
        <h1 className="display-5 fw-bold mb-3">Tap. Scan. Connect.</h1>

        <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
          Create a beautiful digital business card with NFC, QR and vCard download. Update your details anytime—no reprints needed.
        </p>

        <div className="d-flex gap-3 justify-content-center mt-4">
          <Link className="btn btn-primary" href="/auth/login">
            <i className="bi bi-person-plus me-2" />
            Get Started
          </Link>

          <Link className="btn btn-outline-secondary" href="/card/saadahmad-regular-business-card">
            <i className="bi bi-eye me-2" />
            View Demo
          </Link>
        </div>
      </div>
      <section className="services">

      </section>
      <section className="process-section">
        <div className="container">
          <TabContainer id="left-tabs-example" defaultActiveKey="first">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <Nav variant="pills" className="flex-column">
                  <NavItem>
                    <NavLink eventKey="first"><span>1.</span> Create Account</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="second"><span>2.</span>Complete Profile</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="third"><span>3.</span>Create vCard</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="fourth"><span>4.</span>Submit Your Details</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="fifth"><span>5.</span>Get Public Link</NavLink>
                  </NavItem>
                </Nav>
              </div>
              <div className="col-lg-8 col-md-6 col-12">
                <TabContent>
                  <TabPane eventKey="first" className='text-dark'>First tab content</TabPane>
                  <TabPane eventKey="second" className='text-dark'>Second tab content</TabPane>
                  <TabPane eventKey="third" className='text-dark'>Third tab content</TabPane>
                  <TabPane eventKey="fourth" className='text-dark'>Fourth tab content</TabPane>
                  <TabPane eventKey="fifth" className='text-dark'>Fifth tab content</TabPane>
                </TabContent>
              </div>
            </div>
          </TabContainer>
        </div>
      </section>
      <section className="faq-section dark-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12">
              <Accordion defaultActiveKey="0" flush>
                <AccordionItem eventKey="0">
                  <AccordionHeader>Accordion Item #1</AccordionHeader>
                  <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem eventKey="1">
                  <AccordionHeader>Accordion Item #2</AccordionHeader>
                  <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem eventKey="2">
                  <AccordionHeader>Accordion Item #3</AccordionHeader>
                  <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem eventKey="3">
                  <AccordionHeader>Accordion Item #4</AccordionHeader>
                  <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem eventKey="4">
                  <AccordionHeader>Accordion Item #5</AccordionHeader>
                  <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5 col-md-6 col-12">
              <div className="content-side">
                <h2>
                  Let's get to work
                </h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque sint odio velit laudantium, repellendus accusantium! Aliquid illo minima itaque, ipsa, officia non aliquam possimus, et debitis est rem officiis harum.
                </p>
                <div className="social-box">
                  <ul>
                    <li>
                      <a href="https://wa.me/+923110882255">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/in/isaadahmad/">
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/saadahmad888">
                        <i className="bi bi-github"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="contact-box">
                <form action="" className="contact-form">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label" htmlFor="fullName">Full Name</label>
                      <input className="form-control" type="text" name="fullName" id="fullName" />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 mb-4">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input className="form-control" type="email" name="email" id="email" />
                    </div>
                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="message">Message</label>
                      <textarea className="form-control" name="message" id="message" rows={5}></textarea>
                    </div>
                    <div className="col-12">
                      <button type="button">
                        Submit
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}