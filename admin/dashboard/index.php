<?php
session_start();
include '../../auth/conn.php';
if ((isset($_SESSION['uid']))) {
    header("Location: ../index.php");
} else {
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Admin Dashboard | <?php echo $_SESSION['name'] ?></title>
    <style>
        body {
            margin: 0;
            /* padding: 2px; */
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            padding: 0;
        }

        header {
            padding: 10px;
            background-color: black;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo img {
            padding: 10px;
            width: 100px;
        }

        nav ul li {
            margin: 2px;
            align-content: center;
            display: inline-block;
        }


        nav ul li a {
            color: white;
            text-decoration: none;
        }

        .btnbtn:hover {
            padding: 20px 40px;
        }
    </style>
</head>

<body>
    <header>
        <div class="logo">
            <img src="../../includes/images/logo/logo.png" alt="" srcset="">- Anchal Didi
        </div>
        <nav>
            <ul>
                <li><a disabled="disabled" href="#">Home</a></li>
                <!-- <li><a href="">Portfolio</a></li> -->
                <li><a style="margin-top: 20px" disabled="disabled" href="#"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">Add Portfolio</button></a></li>
                <li><a href="../../logout.php">Logout</a></li>
                <li><a href=""></a></li>
                <li><a href=""></a></li>
            </ul>
        </nav>
    </header>
    <style>
        .card-portfolio {
            display: flex;
            justify-content: space-around;
            /* border: 1px solid black; */
            /* height: 200px; */
            padding: 20px;
            margin: 2px;
            flex-wrap: wrap;
        }

        .item {
            border: 1px solid red;
            width: 300px;
            /* padding: 10px; */
            margin: 2px;
            /* max-height: 300px; */
            /* height: 210px; */
        }

        .title {
            display: flex;
            justify-content: space-between;
            background-color: black;
            color: white;
            padding: 5px;
        }

        .post-img {
            /* max-width: 100px; */
            padding: 5px;
        }

        .post-img img {
            width: 100%;
            max-height: 201px;
            height: 200px;
        }

        .btn-action {
            position: absolute;
            right: 0;
            bottom: 0;
            position: relative;
            bottom: 0;
            border: 1px solid red;
        }

        .action-btn .btn-danger,
        a {
            color: white;

        }
    </style>

    <div class="card-portfolio">
        <?php
        $sql_query = "Select * from portfolio";
        $query = mysqli_query($conn, $sql_query);
        if ($query) {
            while ($row = mysqli_fetch_assoc($query)) {
        ?>
                <div class="item">

                    <div class="title">
                        <div class="row-t">

                            <?php echo $row['title']; ?>
                        </div>
                        <div class="action btn btn-danger">
                            <a href="../pDelte.php?id=<?php echo $row['pid'] ?>">Delete</a>
                        </div>
                    </div>
                    <div class="post-img">
                        <img src="../../upload/portfolio/<?php echo $row['photo'] ?>" alt="">
                    </div>


                </div>
        <?php
            }
        } ?>
    </div>



    <!-- Modal -->



    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">New Portfolio</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="../addPortfolio.php" method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Title </label>
                            <input type="text" name="title" class="form-control" id="recipient-name">
                        </div>
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Description</label>
                            <input name="desc" id="fileToUpload" type="text" class="form-control" id="recipient-name">
                        </div>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Photo:</label><br>
                            <input type="file" name="photo" id="">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" name="submit" class="btn btn-success">Publish</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <!-- add model  -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>

</html>