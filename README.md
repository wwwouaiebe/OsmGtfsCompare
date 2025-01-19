# OsmGtfsCompare

## Coming soon

## detected errors and how to solve

First use your brain.

### Error M001: Route wihout route_master ...

A route is not attached to a route_master. Search or create the route_master and add the route.
It's important to fix this error first because routes without route_master are not longer controlled.

### Error M003: a relation member of the route_master is not a bus/tram/subway relation

A relation is present in the route_master but it's not a bus/tram/subway route. Verify the tags of this bad relation or remove it from the route_master

### Error M004: a member of the route master is not a relation

A way or a node is found as member of the route_master. Remove it from the route_master

### Error M005: route_master without ref tag 

A route_master without ref tag is found.Add the ref tag

### Error M006: ref tag of the route master (...) is not the same than the ref tag of the route (...)

Verify the ref tag of the route and on the route master

### Error M007: invalid name for route_master (must be ...) ...

The name must be 'Bus ' or 'Tram ' or 'Subway' + the value of the ref tag

### Error M008:

### Error R001: hole found for route ... between way id ... and way id ...

A hole is found in the ways of the bus/tram/subway route. Verify the order of the ways and verify if a way is not missing.

### Error R002: a from tag is not found for route ...

A from tag is missing. Add the tag to the bus/tram/subway route

### Error R003: the from tag is not equal to the name of the first platform for route...

The from tag must be equal to the name of the first platform. Correct the from tag.
If the platform is shared between 2 operators and have a different name for each operator the name:operator 
is also valid

### Error R004: a to tag is not found for route ...

A to tag is missing. Add the tag to the bus route

### Error R005: the to tag is not equal to the name of the last platform for route ...

The to tag must be equal to the name of the last platform. Correct the to tag.
If the platform is shared between 2 operators and have a different name for each operator the name:operator 
is also valid

### Error R006: invalid name for route ...

The name of a route must be 'Bus ' + the ref tag of the route + ': ' + the from tag of the route + ' → ' + the to tag of the route

### Error R008: an unordered object with a role ... is found in the ways of route ...

Reorder the objects in the bus route. Platform and stop must be before the ways in the route relation

### Error R009: an invalid node ... is used as platform for the route ...

The node used as platform don't have a highway=bus_stop tag. Correct the node or remove it from the bus route

### Error R010: an invalid way ... is used as platform for the route ... 

The way used as platform don't have a highway=platform tag . Correct the way or remove it from the bus route

### Error R011: an invalid node ... is used as stop_position for the route ...

The node used as stop_position don't have a public_transport=stop_position tag. Correct the node or remove it from the bus route

### Error R012: an invalid object ... is used as stop_position for the route ...

A way or a relation is used as stop_position. A stop_position must be a node

### Error R013: an invalid highway ... is used as way for the route ...

This kind of way is normally not for motor vehicle (It's a footway, a cycleway, a pedestrian ...) Correct the way (change the highway tag) or add a bus=yes or a psv=yes tag.

### Error R014: an invalid railway ... is used as way for the route ...

Each way object of a tram route must have a tag railway=tram. Each way object of a subway route must have a tag railway=subway. Correct the way.

### Error R015: an invalid object ... is used as way for the route ...

A node or a relation is used as way for the bus route. Verify the role of the object (bus_stop or stop_position without role) or remove the object from the bus route

### Error R016: an unknow role ... is found in the route ... for the osm object ... 

The role is not a valid role for a bus/tram/subway relation. Verify the role or remove the object. Valid roles are 'platform', 'platform_entry_only', 'platform_exit_only' and 'stop'

### Warning R017: A road under construction ...  is used as way for the route

### Error R018: route with more than one route_master

A route is attached to more than one route_master. Correct the route_masters and probably remove one of the route_master

### Warning R019: a fixme exists for this relation ...

### Error R020: a ref tag is not found for route

### Error R021: a name tag is not found for route

### Warning T001: unuseful ... tag

### Error T002: invalid value ... for tag...

### Error T003: no ... tag

### Error T004: the operator tag is not valid  ... 

### Error T005: no operator tag found

### Error T006: the network tag is not valid  ...

### Error T007: no network tag found

### Error C001: the osm description is not equal to the GTFS route long name