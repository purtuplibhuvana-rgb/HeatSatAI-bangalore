from pathlib import Path
from pyrosm import OSM

# --------------------------------------------------
# Project paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

PBF = PROJECT_ROOT / "data" / "raw" / "osm" / "bengaluru.osm.pbf"

OUTPUT = PROJECT_ROOT / "data" / "raw" / "osm"

OUTPUT.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("HeatSat AI - OSM Downloader")
print("=" * 60)

print(f"\nLoading:\n{PBF}")

osm = OSM(str(PBF))

print("\nExtracting buildings...")
buildings = osm.get_buildings()

print("\nSaving GeoJSON...")

output_file = OUTPUT / "buildings.geojson"

buildings.to_file(output_file, driver="GeoJSON")

print("\nDone!")
print(f"Buildings extracted : {len(buildings):,}")
print(f"Saved to            : {output_file}")

print("\nExtracting roads...")

roads = osm.get_network(network_type="all")

roads.to_file(
    OUTPUT / "roads.geojson",
    driver="GeoJSON"
)

print(f"Roads extracted : {len(roads):,}")

print("\nExtracting water bodies...")

water = osm.get_natural(custom_filter={"natural": ["water"]})

water.to_file(
    OUTPUT / "water.geojson",
    driver="GeoJSON"
)

print(f"Water bodies : {len(water):,}")

print("\nExtracting parks...")

parks = osm.get_landuse(custom_filter={"leisure": ["park"]})

parks.to_file(
    OUTPUT / "parks.geojson",
    driver="GeoJSON"
)

print(f"Parks : {len(parks):,}")

print("\nExtracting landuse...")

landuse = osm.get_landuse()

landuse.to_file(
    OUTPUT / "landuse.geojson",
    driver="GeoJSON"
)

print(f"Landuse polygons : {len(landuse):,}")

print("\nExtracting railways...")

rail = osm.get_data_by_custom_criteria(
    custom_filter={"railway": True}
)

rail.to_file(
    OUTPUT / "railways.geojson",
    driver="GeoJSON"
)

print(f"Railways : {len(rail):,}")

try:
    print("\nExtracting roads...")
    roads = osm.get_network(network_type="all")
    roads.to_file(OUTPUT / "roads.geojson", driver="GeoJSON")
    print(f"✓ Roads: {len(roads):,}")

except Exception as e:
    print(f"✗ Roads failed: {e}")

    print("\nExtracting schools...")

schools = osm.get_pois(
    custom_filter={"amenity": ["school"]}
)

schools.to_file(
    OUTPUT / "schools.geojson",
    driver="GeoJSON"
)

print(f"Schools : {len(schools):,}")

print("\nExtracting colleges...")

colleges = osm.get_pois(
    custom_filter={
        "amenity": [
            "college",
            "university"
        ]
    }
)

colleges.to_file(
    OUTPUT / "colleges.geojson",
    driver="GeoJSON"
)

print(f"Colleges : {len(colleges):,}")

print("\nExtracting hospitals...")

hospitals = osm.get_pois(
    custom_filter={
        "amenity": [
            "hospital"
        ]
    }
)

hospitals.to_file(
    OUTPUT / "hospitals.geojson",
    driver="GeoJSON"
)

print(f"Hospitals : {len(hospitals):,}")

print("\nExtracting clinics...")

clinics = osm.get_pois(
    custom_filter={
        "amenity": [
            "clinic"
        ]
    }
)

clinics.to_file(
    OUTPUT / "clinics.geojson",
    driver="GeoJSON"
)

print(f"Clinics : {len(clinics):,}")

print("\nExtracting bus stops...")

bus_stops = osm.get_pois(
    custom_filter={
        "highway": [
            "bus_stop"
        ]
    }
)

bus_stops.to_file(
    OUTPUT / "bus_stops.geojson",
    driver="GeoJSON"
)

print(f"Bus Stops : {len(bus_stops):,}")

print("\nExtracting metro stations...")

metro = osm.get_pois(
    custom_filter={
        "railway": [
            "station"
        ]
    }
)

metro.to_file(
    OUTPUT / "metro.geojson",
    driver="GeoJSON"
)

print(f"Metro Stations : {len(metro):,}")

print("\nExtracting forests...")

forests = osm.get_data_by_custom_criteria(
    custom_filter={"landuse": ["forest"]}
)

forests.to_file(
    OUTPUT / "forests.geojson",
    driver="GeoJSON"
)

print(f"Forests : {len(forests):,}")

print("\nExtracting grass...")

grass = osm.get_data_by_custom_criteria(
    custom_filter={"landuse": ["grass", "meadow"]}
)

grass.to_file(
    OUTPUT / "grass.geojson",
    driver="GeoJSON"
)

print(f"Grass : {len(grass):,}")

print("\nExtracting industrial areas...")

industrial = osm.get_data_by_custom_criteria(
    custom_filter={"landuse": ["industrial"]}
)

industrial.to_file(
    OUTPUT / "industrial.geojson",
    driver="GeoJSON"
)

print(f"Industrial : {len(industrial):,}")

print("\nExtracting commercial areas...")

commercial = osm.get_data_by_custom_criteria(
    custom_filter={"landuse": ["commercial"]}
)

commercial.to_file(
    OUTPUT / "commercial.geojson",
    driver="GeoJSON"
)

print(f"Commercial : {len(commercial):,}")

print("\nExtracting residential areas...")

residential = osm.get_data_by_custom_criteria(
    custom_filter={"landuse": ["residential"]}
)

residential.to_file(
    OUTPUT / "residential.geojson",
    driver="GeoJSON"
)

print(f"Residential : {len(residential):,}")

