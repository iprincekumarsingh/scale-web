<?php
// Get data from form
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$subject = $_POST['subject'];


$message = $_POST['inputMessage'];

$to = "scale@scaleservice.in";
$to_user = $email;
$subject = `$subject` . " | Scale ";

$txt = "Name = " . $name . "\r\n Subject = " . $subject . "\r\n Email = "
    .  $email . "\r\n Message =" . $message;
$user_welcome_msg = "Hey there {$name},
Welcome to SCALE. Thank you for contacting us. You will soon get a reply from the team. We are the best solution for your problem.
Thank You,
Team SCALE.";

$headers = "From: Scale-Services@scaleservice.in" . "\r\n";

$headers2 = "From:Team-Scale@scaleservices.in" . "\r\n";
echo $name;
if ($email != NULL) {
    mail($to, $subject, $txt, $headers);
    echo 1;

}
else{
    echo 0;
}
if ($email != null) {
    mail($to_user, "Scale", $user_welcome_msg, $headers2);
    echo 1;
}
else{
    echo 0;
}
// return;
// Redirect to
// header("Location:index.html");
