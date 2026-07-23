<?php

include("db.php");

$username = $_GET['username'];

// Search query
$sql = "SELECT * FROM users WHERE username='$username'";

$result = mysqli_query($conn, $sql);

echo "<h2>Search Results</h2>";

if (mysqli_num_rows($result) > 0) {

    echo "<table border='1' cellpadding='10'>";
    echo "<tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
          </tr>";

    while ($row = mysqli_fetch_assoc($result)) {

        echo "<tr>";

        echo "<td>".$row['id']."</td>";
        echo "<td>".$row['username']."</td>";
        echo "<td>".$row['email']."</td>";
        echo "<td>".$row['password']."</td>";

        echo "</tr>";
    }

    echo "</table>";

} else {

    echo "No User Found.";

}

?>