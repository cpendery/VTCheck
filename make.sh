docker-compose up -d
sleep 5
docker-compose run mysql app/dbStart.sh
echo "Containers Up & Database Populated"