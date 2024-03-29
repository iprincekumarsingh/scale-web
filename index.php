<!DOCTYPE html>
<html class="no-js" lang="zxx">
<?php session_start(); ?>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>SCALE | Social Media Marketing Agency</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Place favicon.ico in the root directory -->
    <link rel="shortcut icon" href="images/logo/favicon-16x16.png" type="image/x-icon" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>

    <!-- All css here -->
    <link rel="stylesheet" href="includes/css/bootstrap.min.css" />
    <link rel="stylesheet" href="includes/css/fontawesome-all.min.css" />
    <link rel="stylesheet" href="includes/css/animate.css" />
    <link rel="stylesheet" href="includes/css/slick.css" />
    <link rel="stylesheet" href="includes/css/meanmenu.css" />
    <link rel="stylesheet" href="includes/css/default.css" />
    <link rel="stylesheet" href="includes/css/style.css" />
    <link rel="stylesheet" href="includes/css/responsive.css" />
    <style>
        @media screen and (max-width: 767px) {
            .connected-info-text p span {
                width: 100px;
            }
        }
    </style>
</head>

<body>

    <!--  ====== preloader=============================================  -->
    <div id="preloader">
        <div id="loading">
            <div id="loading-center">
                <div id="loading-center-absolute">
                    <div class="object" id="object_one"></div>
                    <div class="object" id="object_two"></div>
                    <div class="object" id="object_three"></div>
                    <div class="object" id="object_four"></div>
                    <div class="object" id="object_five"></div>
                    <div class="object" id="object_six"></div>
                    <div class="object" id="object_seven"></div>
                    <div class="object" id="object_eight"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- /preloader -->

    <!--  ====== header-area-start=======================================  -->
    <header>
        <div style="" id="header-sticky" class="transparent-header header-area">
            <div style="background:black;" class="header header1">
                <div class="container">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-4">
                            <div class="logo d-inline-block">
                                <a href="index.php"><img style="width: 200px" src="includes/images/logo/logo.png" alt="2020" /></a>
                            </div>
                        </div>
                        <!-- /col -->
                        <div class="col-xl-8 col-lg-9 col-md-8 col-sm-8 col-8 d-flex align-items-center justify-content-end">
                            <div class="main-menu">
                                <nav id="mobile-menu">
                                    <ul class="d-block">
                                        <li>
                                            <a class="active" href="#home">Home</a>
                                        </li>
                                        <li>
                                            <a href="#about">About</a>
                                        </li>
                                        <li>
                                            <a href="#product">Services</a>
                                        </li>
                                        <li>
                                            <a href="#team">team</a>
                                        </li>

                                        <li st>
                                            <a style="border: 1px solid black;
                        padding: 10px 20px;
                        border-radius: 5px;
                        background: #3300ff;
                        color: white;" href="#contact">Contact Us</a>
                                        </li>
                                        <?php
                                        if (isset($_SESSION['id'])) {

                                        ?>

                                            <li>
                                                <a href="#team">Dashboard</a>
                                            </li>
                                            <li>
                                                <a href="logout.php">Logout</a>
                                            </li>
                                        <?php    }
                                        ?>
                                    </ul>
                                </nav>
                            </div>
                            <!-- /main-menu -->


                            <!-- social-link -->

                            <div class="d-block d-lg-none pl-25">
                                <a class="mobile-menubar theme-color" href="javascript:void(0);"><i class="far fa-bars"></i></a>
                            </div>
                            <!-- <div class="mobile-menu"></div> -->
                        </div>
                        <!-- /col -->
                    </div>
                    <!-- /row -->
                </div>
                <!-- /container -->
            </div>
        </div>
        <!-- /header-bottom -->
    </header>
    <!--  header-area-end  -->

    <!--  ====== header extra info start================================== -->
    <!-- side-mobile-menu start -->
    <div class="side-mobile-menu bg-white pt-30 pb-30 pl-30 pr-30">
        <div class="close-icon float-right mb-20">
            <a href="javascript:void(0);"><span class="icon-clear theme-color"><i class="fa fa-times"></i></span></a>
        </div>
        <div class="mobile-menu"></div>


        <!-- social-link -->
    </div>
    <!-- /side-mobile-menu -->
    <div class="body-overlay"></div>
    <!-- header extra info end  -->

    <main>
        <!-- ======slider-area-start=========================================== -->
        <div id="home" class="slider-area slider-area1 position-relative over-hidden">
            <div id="scene" class="position-absolute w-100 h-100 z-index11">
                <img data-depth="0.20" class="shape shape-1 d-none d-lg-block" src="images/banner/shape/shape1.png" alt="#" />
                <img data-depth="0.15" class="shape shape-2 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape2.png" alt="#" />
                <img data-depth="0.30" class="shape shape-3 d-none d-lg-block" src="includes/images/banner/shape/shape3.png" alt="#" />
                <img data-depth="0.10" class="shape shape-4 d-none d-lg-block" src="includes/images/banner/shape/shape4.png" alt="#" />
                <img data-depth="0.20" class="shape shape-5 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape5.png" alt="#" />
                <img data-depth="0.25" class="shape shape-6 d-none d-lg-block" src="includes/images/banner/shape/shape6.png" alt="" />
                <img data-depth="0.10" class="shape shape-7 d-none d-lg-block" src="includes/images/banner/shape/shape7.png" alt="" />
                <img data-depth="0.30" class="shape shape-8 d-none d-lg-block" src="includes/images/banner/shape/shape8.png" alt="" />
                <img data-depth="0.15" class="shape shape-9 d-none d-lg-block" src="includes/images/banner/shape/shape9.png" alt="" />
                <img data-depth="0.10" class="shape shape-10 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape10.png" alt="" />
                <img data-depth="0.20" class="shape shape-11 d-none d-lg-block" src="includes/images/banner/shape/shape11.png" alt="" />
                <img data-depth="0.15" class="shape shape-12 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape10.png" alt="" />
                <img data-depth="0.25" class="shape shape-13 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape5.png" alt="" />
                <img data-depth="0.10" class="shape shape-14 sm-shape d-none d-lg-block" src="includes/images/banner/shape/shape5.png" alt="" />
            </div>
            <!-- /shape-slider -->
            <div class="container">
                <div class="single-slider slider-height1 d-flex align-items-center">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
                            <div class="slider-content mt-90 position-relative">
                                <img class="slider-dotted position-absolute" src="includes/images/banner/shape/banner-dotted.png" alt="" />


                                <h1 class="wow fadeInLeft f-700 pb-20">Welcome to SCALE</h1>
                                <p class="wow fadeInUp" data-wow-duration="1.2s" data-wow-delay=".3s">
                                    We are the best Social Media Marketing Agency out there. We
                                    fulfill all your growth needs and help you to grow your
                                    brand.
                                </p>

                            </div>
                        </div>
                        <!-- /col -->
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-10 col-12 d-flex align-items-center">
                            <div class="slider-img1 wow fadeInRight" data-wow-duration="1.5s">
                                <img class="bounce-animate" src="includes/images/banner/slider-img.png" alt="" />
                            </div>
                        </div>
                        <!-- /col -->
                    </div>
                    <!-- /row -->
                    <div class="slider-bg">
                        <img class="w-100 z-index-1" src="includes/images/banner/bg.png" alt="" />
                    </div>
                    <!-- /slider-bg -->
                </div>
            </div>
            <!-- /container -->
        </div>
        <!-- slider-area-end=  -->

        <!-- ====== feature-area-start=========================================== -->
        <div id="about" class="about-area mt-95 over-hidden">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-xl-5 offset-xl-0 col-lg-5 offset-lg-0 col-md-10 offset-md-1 col-sm-12 col-12">
                        <div class="about-img text-center wow fadeInLeft" data-wow-duration="1.6s">
                            <img src="includes/images/bg/about-img.png" alt="" />
                        </div>
                        <!-- /about-img -->
                    </div>
                    <!-- /col -->
                    <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                        <div class="about-content mt-35 mb-50 pt-10">
                            <div class="title">
                                <h3 class="f-700">WHY YOU SHOULD WORK WITH US?</h3>
                            </div>
                            <ul class="about-text mt-55 d-md-flex justify-content-between">
                                <li class="mr-25">
                                    <p>
                                        <b>Video Production</b>
                                    <p style="    word-break: break-word;">
                                        We record high quality videos for your brand if your brand is in our reach area.
                                    </p>
                                    <br>
                                    <p style="    word-break: break-word;">
                                        <b> Content research</b>
                                        <br>
                                        We help you to find the best content in your niche.
                                    </p>

                                    <br>

                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <b>

                                            Graphic Designing
                                        </b>
                                    <p style="    word-break: break-word;">
                                        Best quality graphic designs that will have high audience retention ratio.
                                    </p>
                                    </p>
                                    <p>

                                        <b>
                                            Social media Campaigns
                                        </b>
                                    <p style="    word-break: break-word;">

                                        We can spread awareness of your brand through ads, influencer marketing, Page
                                        promotion and many more.
                                    </p>
                                </li>
                            </ul>

                        </div>
                        <!-- /about-content -->
                    </div>
                    <!-- /col -->
                </div>
                <!-- /row -->
            </div>
            <!-- /container -->
        </div>
        <!-- feature-area-end -->

        <!-- ====== service-area-start ==================================== -->

        <!-- service-area-end  -->

        <div class="feature-product-wrapper-bg position-relative">
            <!-- ====== feature-area-start=========================================== -->
            <div class="feature-area feature-product-bg mb-100 pt-100 over-hidden">
                <div class="container">
                    <div class="row">
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div class="feature-img wow fadeInLeft" data-wow-duration="1.6s">
                                <img src="includes/images/feature/feature-img.png" alt="" />
                            </div>
                            <!-- /service-img -->
                        </div>
                        <!-- /col -->
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div class="feature-content mt-100">
                                <div class="title">
                                    <h3 class="f-700">Never compromise with Quality</h3>
                                </div>
                                <!-- /title -->
                                <ul class="feature-text mt-50">
                                    <li class="d-flex">
                                        <span class="feature-icon theme-color d-inline-block mr-20"><i class="fal fa-check"></i></span>
                                        <p>
                                            High quality videos for your brand
                                        </p>
                                    </li>
                                    <li class="d-flex">
                                        <span class="feature-icon theme-color d-inline-block mr-20"><i class="fal fa-check"></i></span>
                                        <p>
                                            High quality and engaging videos
                                        </p>
                                    </li>
                                    <li class="d-flex">
                                        <span class="feature-icon theme-color d-inline-block mr-20"><i class="fal fa-check"></i></span>
                                        <p>
                                            Best content in your niche
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <!-- /service-content -->
                        </div>
                        <!-- /col -->
                    </div>
                    <!-- /row -->
                </div>
                <!-- /container -->
            </div>
            <!-- feature-area-end -->

            <!-- ====== our-product-area-start================================ -->
            <div id="product" class="product-area pt-110 pb-260 over-hidden">
                <div class="container position-relative">
                    <div class="product-bg">
                        <img src="includes/images/product/product-bg.png" alt="" />
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-xl-6 col-lg-7 col-md-8 col-sm-12 col-12">
                            <div class="title text-center d-inline-block mb-70">
                                <h4 class="f-700 mb-10">Our #Services</h4>
                                <p style="visibility: hidden;">
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip ex ea
                                </p>
                            </div>
                            <!-- /title -->
                        </div>
                        <!-- /col -->
                    </div>
                    <!-- /row -->
                    <div class="row">
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                            <div class="single-product bg-white text-center pl-45 pr-45 pt-65 pb-50 mb-50 theme-border-b wow fadeInUp" data-wow-duration="1.2s">
                                <h5 class="f-700">#Instagram</h5>
                                <div class="pro-icon mt-50 mb-45">
                                    <img width="66px" src="includes/images/product/insta.png" alt="" />
                                </div>
                                <p>
                                    Instagram Account Handling, Content Creation,<br />
                                    Ads Management Profile Optimisation.
                                </p>
                                <div class="btn-3 d-inline-block mt-25">
                                    <!-- <a href="#" class="primary-color text-capitalize f-700 d-block"  data-toggle="modal" data-target="#exampleModal-p1">view details</a> -->
                                </div>
                            </div>
                            <!-- /single-product -->

                        </div>
                        <!-- /col -->
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm- col-">
                            <div class="single-product bg-white text-center pl-45 pr-45 pt-65 pb-50 mb-50 theme-border-b wow fadeInUp" data-wow-duration="1.4s">
                                <h5 class="f-700">#Youtube</h5>
                                <div class="pro-icon mt-50 mb-45">
                                    <img width="127px" src="includes/images/product/youtube.png" alt="" />
                                </div>
                                <p>
                                    Content Research, Youtube Ads management, Thumbnail Design,
                                    Video editing
                                </p>
                                <div class="btn-3 d-inline-block mt-25">
                                    <!-- <a href="#" data-toggle="modal" data-target="#exampleModal-p2" class="primary-color text-capitalize f-700 d-block">view details</a> -->
                                </div>
                            </div>
                            <!-- /single-product -->

                        </div>
                        <!-- /col -->
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm- col-">
                            <div class="single-product bg-white text-center pl-45 pr-45 pt-65 pb-50 mb-50 theme-border-b wow fadeInUp" data-wow-duration="1.5s">
                                <h5 class="f-700">NFT</h5>
                                <div class="pro-icon mt-50 mb-45">
                                    <img width="120px" src="includes/images/product/nft.png" alt="" />
                                </div>
                                <p>
                                    Marketing,<br />
                                    Outreach potential investors, NFT collection Sale
                                </p>
                                <div class="btn-3 d-inline-block mt-25">
                                    <!-- <a href="#" data-toggle="modal" data-target="#exampleModal-p3" class="primary-color text-capitalize f-700 d-block">view details</a> -->
                                </div>
                            </div>
                            <!-- /single-product -->
                            <!-- Modal start -->

                        </div>
                        <!-- /col -->

                    </div>
                    <!-- /row -->
                </div>
                <!-- /container -->
            </div>
            <!-- /product-area -->
            <!-- our-product-area-end  -->
            <img class="f-img-bg w-100 position-absolute top-0 left-0 right-0 w-100 mt-50 mb-100 z-index-1" src="includes/images/feature/feature-bg.png" alt="" />
        </div>
        <!-- /feature-product-wrapper-bg -->



        <!-- ====== team-area-start=========================================== -->
        <div id="team" class="team-area primary-bg pt-130 pb-115 over-hidden">
            <div class="container">
                <div style="display: flex;
          justify-content: center;" class="row">
                    <div class="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div class="service-content mb-50">
                            <div class="title">
                                <h3 class="f-700 mb-40">Scale Team</h3>
                                <p>
                                    I'm a social media marketer and a content creator. Have 4+ year experience in
                                    content creation and social media managing and marketing.
                                </p>
                            </div>
                        </div>
                        <!-- /service-content -->
                    </div>
                    <!-- /col -->
                    <div class="col-xl-3 offset-xl-1 col-lg-3 offset-lg-5 col-md-4 offset-md-3 col-sm-5 offset-sm-1 col-12 wow fadeInRight" data-wow-duration="1.6s">
                        <div class="single-team-wrapper justify-content-center position-relative">
                            <div class="single-team d-md-flex justify-content-center mb-30">
                                <div class="team-img position-relative">
                                    <img style="    border-radius: 50%;" src="includes/images/team/team1.png" alt="" />
                                    <ul class="social-link text-center position-absolute">
                                        <li class="d-inline-block">
                                            <a class="facebook-color text-center pl-10 pr-10 d-inline-block transition-3" href="https://www.instagram.com/sanskarpani"><i class="fab fa-instagram"></i></a>
                                        </li>
                                        <li class="d-inline-block">
                                            <a class="twitter-color text-center pl-10 pr-10 d-inline-block transition-3" href="https://twitter.com/sanskarpani"><i class="fab fa-twitter"></i></a>
                                        </li>
                                        <li class="d-inline-block">
                                            <a class="linkedin-color text-center pl-10 pr-10 d-inline-block transition-3" href=" https://www.linkedin.com/in/sanskar-pani-5576741b7"><i class="fab fa-linkedin-in"></i></a>
                                        </li>
                                    </ul>
                                    <!-- social-link -->
                                </div>
                                <!-- /team-img -->
                            </div>
                            <div class="team-content team-content-bottom mt-2 ">
                                <h6 style="text-align: center" class="f-700 mb-1">Sanskar Pani</h6>
                                <p style="text-align: center" class="mb-10">Founder of SCALE</p><br>

                            </div>
                            <!-- /single-team -->
                        </div>
                        <!-- /single-team-wrapper -->
                    </div>

                    <!-- /col -->
                </div>
                <!-- /row -->
            </div>
            <!-- /container -->
        </div>
        <!-- team-area-end -->

        <!-- ====== testimonial-area-start=============================================== -->
        <div class="testimonial-area mt-130 mb-30 over-hidden">

            <!-- /container -->
        </div>
        <!-- testimonial-area-end -->


        <!-- ====== blog-area-start ========================================= -->

        <!-- blog-area-end  -->

        <!-- ====== contact-area-start=============================================== -->
        <div id="contact" class="contact-area mb-120">
            <div class="container">
                <div class="row">
                    <div class="col-xl-5 col-lg-5 col-md-10 col-sm-12 col-12">
                        <div class="connected-info mb-50">
                            <div class="title">
                                <h3 class="f-700 mb-40">Stay Connected</h3>
                                <!-- <p class="mb-0">Phasellus seiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p> -->
                            </div>
                            <!-- /title -->
                            <div class="connected-info-text mt-30">
                                <p class="mb-10">
                                    <span class="d-inline-block black-color f-700 pr-15">Instagram</span>@scale.service
                                </p>
                                <p class="mb-10">
                                    <span class="d-inline-block black-color f-700 pr-15">Phone</span>+91 9776936082
                                </p>
                                <p class="mb-10">
                                    <span class="d-inline-block black-color f-700 pr-15">Email</span>getscaleservice@gmail.com
                                </p>
                            </div>
                        </div>
                        <!-- /connected-info -->
                    </div>
                    <!-- /col -->
                    <div class="col-xl-6 offset-xl-1 col-lg-7 col-md-12 col-sm-12 col-12">
                        <div class="contact-form">
                            <form id="contact-form" method="POST">
                                <div class="contact-info mt-10">
                                    <div class="row">
                                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-15 wow fadeInUp" data-wow-duration="1.8s" data-delay=".5s">
                                            <input class="name w-100 border-0 pl-20 ptb-17 pr-10 form-color border-radius10 primary-bg" type="text" name="name" id="name" placeholder="Your Name" required />
                                            <!-- /name -->
                                        </div>
                                        <!-- /col -->
                                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 pl-sm-0 mb-15 wow fadeInUp" data-wow-duration="1.8s" data-delay=".6s">
                                            <input class="email w-100 border-0 pl-20 ptb-17 pr-10 form-color border-radius10 primary-bg" type="email" name="email" id="email" placeholder="Your Email" required />
                                            <!-- /name -->
                                        </div>
                                        <!-- /col -->
                                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-15 wow fadeInUp" data-wow-duration="1.8s" data-delay=".8s">
                                            <input class="phone w-100 border-0 pl-20 ptb-17 pr-10 form-color border-radius10 primary-bg" type="text" name="phone" id="phone" placeholder="Your Phone" required />
                                            <!-- /name -->
                                        </div>
                                        <!-- /col -->
                                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 pl-sm-0 mb-15 wow fadeInUp" data-wow-duration="1.8s" data-delay=".8s">
                                            <input class="subject w-100 border-0 pl-20 ptb-17 pr-10 form-color border-radius10 primary-bg" type="text" name="subject" id="subject" placeholder="Subject" required />
                                            <!-- /name -->
                                        </div>
                                        <!-- /col -->
                                    </div>
                                    <!-- /row -->
                                    <div class="row no-gutters">
                                        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 pr3 w-100 wow fadeInUp" data-wow-duration="1.8s" data-delay="1s">
                                            <textarea class="massage w-100 border-0 pl-20 ptb-17 pr-10 form-color border-radius10 primary-bg" name="inputMessage" id="message" placeholder="Write your message" required></textarea>
                                            <button class="btn d-inline-block theme-bg theme-border2 white-text mt-20 text-capitalize right-0 top-0 bottom-0 wow fadeInUp wow fadeInUp" data-wow-duration="1.8s" data-delay="1.3s" type="submit" name="submit">
                                                Submit Now
                                            </button>
                                        </div>
                                        <!-- /col -->
                                    </div>
                                    <!-- /row -->
                                </div>
                            </form>
                            <p class="form-message"></p>
                        </div>
                    </div>
                    <!-- /col -->
                </div>
                <!-- /row -->
            </div>
            <!-- /container -->
        </div>
        <!-- contact-area-end  -->
    </main>

    <!-- ====== footer-area-start ============================================ -->
    <footer>
        <div class="footer-area over-hidden wow fadeInUp" data-wow-duration="1.6s">
            <!-- /container -->
        </div>
        <div class="footer-bottom mb-35">
            <div class="container">
                <div class="copyright-area mt-20 pb-25">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div class="copyright-text text-center text-md-left mt-20">
                                <p class="mb-0">
                                    All rights reserved ©
                                    <a href="#" class="c-theme f-700">Scale Services</a>
                                </p>
                                <p style="font-size: 13px">Designed & Developed By <a href="https://divelink.in">Dive-Link</a></p>
                            </div>
                        </div>
                        <!-- /col -->
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <ul class="social-link text-center text-md-right mt-20">
                                <li class="d-inline-block">
                                    <a class="facebook-color text-center pl-15 d-inline-block transition-3" href="https://www.facebook.com/SCALE-112321381517133"><i class="fab fa-facebook-f"></i></a>
                                </li>
                                <li class="d-inline-block">
                                    <a class="facebook-color text-center pl-15 d-inline-block transition-3" href="https://www.instagram.com/scale.service/"><i class="fab fa-instagram"></i></a>
                                </li>
                                <!-- <li class="d-inline-block">
                      <a
                        class="twitter-color text-center pl-15 d-inline-block transition-3"
                        href="#"
                        ><i class="fab fa-twitter"></i
                      ></a>
                    </li> -->

                                <li class="d-inline-block">
                                    <a class="linkedin-color text-center pl-15 d-inline-block transition-3" href="https://www.linkedin.com/company/scaleservice/"><i class="fab fa-linkedin-in"></i></a>
                                </li>
                            </ul>
                            <!-- social-link -->
                        </div>
                        <!-- /col -->
                    </div>
                    <!-- /row -->
                </div>
                <!-- /copyright-area -->
            </div>
            <!-- /container -->
        </div>
        </div>
    </footer>
    <script>
        $(document).ready(function() {
            $("form").submit(function(event) {
                var formData = {
                    name: $("#name").val(),
                    phone: $("#phone").val(),
                    email: $("#email").val(),
                    $message: $("#message").val(),
                    $subject: $("#subject").val(),

                };

                $.ajax({
                    type: "POST",
                    url: "form.php",
                    data: formData,
                    dataType: "json",

                }).done(function(data) {
                    console.log(data);
                });

                event.preventDefault();
            });
        });
    </script>
    <!-- back top -->
    <div class="scroll-up" id="scroll">
        <a href="#" class="theme-bg text-white d-block text-center position-fixed mr-10 transition5">
            <span><i class="fal fa-angle-double-up"></i></span>
        </a>
    </div>

    <!-- All js here -->
    <script src="includes/js/vendor/modernizr-3.5.0.min.js"></script>
    <script src="includes/js/vendor/jquery-1.12.4.min.js"></script>
    <script src="includes/js/popper.min.js"></script>
    <script src="includes/js/bootstrap.min.js"></script>
    <script src="includes/js/parallax.js"></script>
    <script src="includes/js/one-page-nav-min.js"></script>
    <script src="includes/js/slick.min.js"></script>
    <script src="includes/js/wow.min.js"></script>
    <script src="includes/js/plugins.js"></script>
    <script src="includes/js/jquery.meanmenu.min.js"></script>
    <script src="includes/js/main.js"></script>
</body>

<!-- Mirrored from ethemestudio.com/demo/2050/2050-html-template/index.html by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 01 Jul 2022 03:10:18 GMT -->

</html>