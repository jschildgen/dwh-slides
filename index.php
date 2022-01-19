<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>DWH Slides</title>
    <link href="./lib/fontawesome.all.min.css" rel="stylesheet">
</head>
<body>

<h1>Slides</h1>
<?php
$files = glob('./*.{html}', GLOB_BRACE);
foreach($files as $file) {
  echo "<a href=\"$file\">$file</a> <a href=\"$file?print-pdf&showNotes=true\"><i class=\"fas fa-print\"></i></a><br>";
}
?>
<hr>
<h1 onClick="javascript:document.querySelector('#exams').style.visibility = document.querySelector('#exams').style.visibility == 'hidden' ? 'visible' : 'hidden';">Exercise Sheets</h1>
<?php
$files = glob('./exercises/*.{html}', GLOB_BRACE);
foreach($files as $file) {
  echo "<a href=\"$file\">$file</a><br>";
}
?>

<hr>
<div id="exams" style="visibility:hidden">
<h1>Exams</h1>
<?php
$files = glob('./exams/*.{html}', GLOB_BRACE);
foreach($files as $file) {
  echo "<a href=\"$file\">$file</a><br>";
}
?>
</div>
</body>
</html>
