<?php
if (isset($_POST['submit']))
{
    $to = "jhgaspay@gmail.com"; // Your email address
    $name = $_POST['name'];
    $from = $_POST['email'];
    $message = $_POST['message'];
    $headers = "From:" . $from;
    $result = mail($to, $subject, $message, $headers);

    if ($result)
    {
        echo '<script type="text/javascript">alert("Your message was sent!");</script>';
        echo '<script type="text/javascript">window.location.href = window.location.href;</script>';

    }
    else
    {
        echo '<script type="text/javascript">alert("Oops! Your message wasn’t sent. Try again later.");</script>';
        echo '<script type="text/javascript">window.location.href = window.location.href;</script>';
    }
}
?>