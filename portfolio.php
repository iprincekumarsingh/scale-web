<!DOCTYPE html>
<html lang="en">
<?php include 'auth/conn.php' ?>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- <link rel="shortcut icon" href="src/img/favicon.png"> -->
	<title>SCALE | Social Media Marketing Agency</title>
	<link rel="stylesheet" href="includes/css-custom/plugins.css">
	<link rel="stylesheet" href="includes/css-custom/blue.css">
</head>

<body>

	<div class="content-wrapper">

		<header style="background:black;" class="wrapper bg-soft-black">
			<nav class="navbar center-nav transparent navbar-expand-lg navbar-light">
				<div class="container flex-lg-row flex-nowrap align-items-center">
					<div class="navbar-brand w-100"><a href="index.html"><img width="200px" src="includes/images/logo/logo.png	" srcset="" alt="" /></a></div>
					<div class="navbar-collapse offcanvas-nav" style="display: flex;flex-direction:space-between">
						<div class="offcanvas-header d-lg-none d-xl-none">
							<a href="index.html"><img src="includes/images/logo/logo.png" srcset="" alt="" /></a>
							<button type="button" class="btn-close btn-close-white offcanvas-close offcanvas-nav-close" aria-label="Close"></button>
						</div>
						<ul class="navbar-nav">
							<li class="nav-item"><a class="nav-link" href="index.php">Home</a>
							<li class=" nav-item"><a class="nav-link" href="#">Portfolio</a>
							<li class="nav-item"><a class="nav-link" href="index.php#about">About</a>
							<li class="nav-item"><a class="nav-link" href="index.php#product">Services</a>
							<li class="nav-item"><a class="nav-link" href="index.php#team">Team</a>


						</ul>
						<div style="background-color: black;" class="navbar-other w-100 d-flex ms-auto">
							<ul class="navbar-nav flex-row align-items-center ms-auto" data-sm-skip="true">
	
								<li class="nav-item d-lg-none">
									<div class="navbar-hamburger"><button class="hamburger animate plain" data-toggle="offcanvas-nav"><span></span></button></div>
								</li>
							</ul>
							<!-- /.navbar-nav -->
						</div>
						<!-- /.navbar-nav -->
					</div>
					<!-- /.navbar-collapse -->

					<!-- /.navbar-other -->
				</div>



				<!-- /.container -->
			</nav>

			<!-- /.navbar -->
		</header>
		<!-- /section -->
		<section class="wrapper bg-light wrapper-border">
			<div class="container py-14 py-md-16">
				<div class="row align-items-center mb-7">
					<div class="col-md-8 col-lg-8 col-xl-7 col-xxl-6 pe-lg-17">
						<h2 class="display-4 mb-3">Recent Projects</h2>
						<p class="lead fs-lg">We love to turn ideas into beautiful things.</p>
					</div>
					<!--/column -->
				</div>
				<!--/.row -->
				<div class="carousel owl-carousel grid-view" data-margin="30" data-dots="true" data-autoplay="false" data-autoplay-timeout="5000" data-responsive='{"0":{"items": "1"}, "768":{"items": "2"}, "992":{"items": "2"}, "1200":{"items": "3"}}'>
					<?php
					$sql_query = "Select * from portfolio";
					$query = mysqli_query($conn, $sql_query);
					if ($query) {
						while ($row = mysqli_fetch_assoc($query)) {
					?>
							<div class="item">
								<figure class="rounded mb-6"><a href="single-project.html"> <img src="upload/portfolio/<?php echo $row['photo'] ?>" alt="" /></a></figure>
								<div class="project-details d-flex justify-content-center flex-column">
									<div class="post-header">
										<div class="post-category text-line mb-3 text-yellow"><?php echo $row['title'] ?></div>
										<h2 class="post-title h3"><?php echo $row['desc_key']?></h2>
									</div>
									<!-- /.post-header -->
								</div>
								<!-- /.project-details -->
							</div>
					<?php
						}
					}
					?>

					<!-- /.item -->


					<!-- /.item -->
				</div>
				<!-- /.owl-carousel -->
			</div>
			<!-- /.container -->
		</section>


	</div>
	<!-- /.content-wrapper -->
	<footer class="bg-dark text-inverse">
		
			</div>
			<!--/.row -->
		</div>
		</div>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous"></script>
		<script src="includes/custom-js/plugins.js"></script>
		<script src="includes/custom-js/script.js"></script>
</body>

</html>