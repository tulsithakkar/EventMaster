const eventModule = angular.module("EventApp", []);
eventModule.controller("eventCtrl", function ($scope, $http) {
    $scope.testMessage = "AngularJS is working"; // Test message
    $scope.events = [];
    $scope.newEvent = {};
    $scope.selectedEvent = {}; // To hold the event being edited
    $scope.editMode = false; // Flag for edit mode
    $scope.msg = "";

    // Fetch events from the server
    $scope.getEvent = function () {
        $http.get("/api/Events").then(
            function (response) {
                $scope.events = response.data;
            },
            function (error) {
                $scope.msg = "Error fetching events";
                console.error(error);
            }
        );
    };

    // Add a new event
    $scope.addEvent = function () {
        console.log("New Event:", $scope.newEvent); // Debugging log for new event
        $http.post("/api/addEvents", $scope.newEvent).then(
            function (response) {
                $scope.msg = response.data.message || "Event added successfully!";
                $scope.getEvent(); // Refresh the event list
                $scope.newEvent = {}; // Reset the form data
                if ($scope.eventForm) {
                    $scope.eventForm.$setPristine();
                    $scope.eventForm.$setUntouched();
                }
            },
            function (error) {
                $scope.msg = "Error adding event";
                console.error(error);
            }
        );
    };

    // Clear the add event form
    $scope.clearForm = function () {
        $scope.newEvent = {}; // Reset the form data
        if ($scope.eventForm) {
            $scope.eventForm.$setPristine();
            $scope.eventForm.$setUntouched();
        }
    };

    // Delete an event
    $scope.deleteEvent = function (_id) {
        $http.delete(`/api/deleteEvent/${_id}`).then(
            function (response) {
                $scope.msg = response.data.message || "Event deleted successfully!";
                $scope.getEvent(); // Refresh the event list
            },
            function (error) {
                $scope.msg = "Error deleting event";
                console.error(error);
            }
        );
    };

    // Set the selected event for editing
    $scope.setEditEvent = function (event) {
        $scope.selectedEvent = angular.copy(event); // Create a copy for editing
        $scope.editMode = true; // Enable edit mode
    };

    // Update an existing event
    
    $scope.updateEvent = function(event) {
        if (!event || !event._id) {
            console.error("No event selected or event ID is missing.");
            return;
        }
        $http.put('/api/editevent/' + event._id, event)
            .then(function(response) {
                $scope.msg = "Event updated successfully!";
                $scope.clearEditForm(); // Clear the edit form after updating
                $scope.getEvent(); // Refresh event list
            }, function(error) {
                $scope.msg = "Error updating event: " + (error.data && error.data.message ? error.data.message : "Unknown error");
                console.error("Error updating event:", error);
            });
    };

    // Clear the edit form
    $scope.clearEditForm = function () {
        $scope.selectedEvent = {}; // Reset the selected event
        $scope.editMode = false; // Disable edit mode
    };

    // Initial fetch of events
    $scope.getEvent();
});
