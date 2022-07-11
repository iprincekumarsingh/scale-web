<!DOCTYPE html>
<html lang="en">

<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='../includes/css/output.css' rel='stylesheet' />
    <title>Admin | Login-In</title>
    <script src='../d33wubrfki0l68.cloudfront.net/js/1da041a93b831bcb6621a55475138572eaec128f/assets/js/password-visibility-toggle.js' type='module'></script>
</head>

<body data-theme="light">

    <!-- Navigation -->
    <nav style="background-color:black;" class="du-navbar flex-col gap-y-1 justify-between
  sm:flex-row  ">
        <a class='du-btn du-btn-ghost normal-case text-xl bg-hite' href='index.html'><img width="100px" src="images/logo/logo.png" alt=""></a>



    </nav>

    <!-- Main area -->
    <main>

        <div class="max-w-screen-xl px-2 py-16 mx-auto space-y-1 sm:px-6 lg:px-8">
            <div class="max-w-lg mx-auto">
                <h1 class="text-2xl font-bold text-center sm:text-3xl">Authorised Person Only </h1>

                <form action="../auth/index.php" method="post" class="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl 
      bg-base-100">
                    <p class="text-lg font-medium">Sign in to your account</p>

                    <!-- Email input -->
                    <div>
                        <label for="email" class="text-sm font-medium">Username</label>

                        <div class="relative mt-1">
                            <input type="text" name="username" id="email" class="custom-input" placeholder="Username" />

                            <span class="absolute inset-y-0 inline-flex items-center right-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <!-- Password input -->
                    <div>
                        <label for="password" class="text-sm font-medium">Password</label>

                        <div class="relative mt-1">
                            <input type="password" id="password" class="custom-input password-field" placeholder="Enter password" name="password" autocomplete="current-password" />

                            <span class="absolute inset-y-0 inline-flex items-center right-4 ">

                                <!-- icons for password visible or not -->
                                <label class="du-swap">

                                    <!-- this hidden checkbox controls the password and icon visibiliy -->
                                    <input type="checkbox" class="hidden passwordVisibiltyBtn" name="" id="">

                                    <!--  password not visible icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="du-swap-off w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>

                                    <!--  password  visible icon  -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="du-swap-on w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </label>

                            </span>
                        </div>
                        <?php if (isset($_GET['error'])) { ?>

                            <p style="color: red;" class="error"><?php echo $_GET['error']; ?></p>

                        <?php } ?>

                    </div>

                    <!-- link to forgot password page -->


                    <!-- Submit button -->
                    <button type="submit" class="du-btn du-btn-primary w-full">
                        Sign in
                    </button>

                    <!-- space to show error text  -->
                    <span id="loginError" class="text-error font-semibold text-sm">

                    </span>

                </form>
            </div>


        </div>


    </main>


</body>


</html>