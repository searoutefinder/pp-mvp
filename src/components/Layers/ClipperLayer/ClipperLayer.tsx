import { useEffect, useRef } from "react"

const ClipperLayer = ({map}) => {
    
    const initializedRef = useRef(false);

    useEffect(() => {
      if (!map || initializedRef.current) return;
      //console.info("The map object has been passed and is ready for use in the Clipper Layer component")
      initializedRef.current = true;
      initializeLayer()
    }, [])

    const initializeLayer = () => {

      map.addSource("clipper-src", {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  [
                    [
                      23.24838,
                      42.729608
                    ],
                    [
                      23.24775,
                      42.644969
                    ],
                    [
                      23.383875,
                      42.643832
                    ],
                    [
                      23.383875,
                      42.730735
                    ],
                    [
                      23.24838,
                      42.729608
                    ]
                  ],
                  [
                    [
                      23.31526566193912,
                      42.68734758583128
                    ],
                    [
                      23.316268356222757,
                      42.68654514098219
                    ],
                    [
                      23.31567122778579,
                      42.68612423794613
                    ],
                    [
                      23.316177800454035,
                      42.68571107944223
                    ],
                    [
                      23.31674285272723,
                      42.68531634411053
                    ],
                    [
                      23.317011790039633,
                      42.68517638954025
                    ],
                    [
                      23.31735,
                      42.685335
                    ],
                    [
                      23.317799,
                      42.685271
                    ],
                    [
                      23.317661,
                      42.684748
                    ],
                    [
                      23.318006,
                      42.684723
                    ],
                    [
                      23.318214,
                      42.684189
                    ],
                    [
                      23.318456,
                      42.684068
                    ],
                    [
                      23.320063,
                      42.683909
                    ],
                    [
                      23.320539,
                      42.686641
                    ],
                    [
                      23.320703,
                      42.687702
                    ],
                    [
                      23.316269,
                      42.688541
                    ],
                    [
                      23.315984,
                      42.687854
                    ],
                    [
                      23.31526566193912,
                      42.68734758583128
                    ]
                  ]
                ],
                "type": "Polygon"
              }
            } 
          ]}
        }
      )
        
      map.addLayer({
        id: 'clipper-lyr',
        type: 'clip',
        source: 'clipper-src',
        layout: {
          'clip-layer-types': ['symbol', 'model']
        },
        maxzoom: 21
      }); 

    }

    return ('')
}
export default ClipperLayer