import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';

export default Ember.Route.extend(mapBboxRoute, {
  queryParams: {
    onestop_id: {
      refreshModel: true
    },
    serves: {
      refreshModel: true
    },
    operated_by: {
      refreshModel: true
    },
    vehicle_type: {
      refreshModel: true
    },
    style_routes_by: {
      refreshModel: true
    }
  },
  setupController: function (controller, model) {
    if (controller.get('bbox') !== null){
      var coordinateArray = [];
      var bboxString = controller.get('bbox');
      var tempArray = [];
      var boundsArray = [];
      coordinateArray = bboxString.split(',');
      for (var i = 0; i < coordinateArray.length; i++){
        tempArray.push(parseFloat(coordinateArray[i]));
      }
      var arrayOne = [];
      var arrayTwo = [];
      arrayOne.push(tempArray[1]);
      arrayOne.push(tempArray[0]);
      arrayTwo.push(tempArray[3]);
      arrayTwo.push(tempArray[2]);
      boundsArray.push(arrayOne);
      boundsArray.push(arrayTwo);
      controller.set('leafletBbox', boundsArray);
    }
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern'); 
    return this.store.query('data/transitland/route', params).then(function(routes){
      var firstRoute = routes.get('firstObject');
      var routeOnestopId = firstRoute.get('onestop_id');
      if (firstRoute !== null){
          var url = 'https://transit.land/api/v1/stops.geojson?&served_by=';
          url += routeOnestopId;
          return Ember.RSVP.hash({
            routes: routes,
            stops: Ember.$.ajax({ url })
          });
      } else {
        return Ember.RSVP.hash({
          routes: routes,
        });
      }
    });
  }
});