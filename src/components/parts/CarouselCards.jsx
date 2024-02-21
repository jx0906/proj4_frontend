import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import {
  Paper,
  Title,
  Button,
  useMantineTheme,
  rem,
} from "@mantine/core";
import classes from "./CarouselCards.module.css";

const carouselData = [
  {
    image:
      "https://media.istockphoto.com/id/842797430/photo/dietary-fiber-food-still-life.jpg?s=1024x1024&w=is&k=20&c=uluxXxkoodammogpT20Ibiw9yn_pPoKPs4wUtuTgGOM=",
    title: "Mastering gluten-free baking",
    articleLink: "https://fasteasybread.com/gluten-free-baking/",
  },
  {
    image:
      "https://media.istockphoto.com/id/1368565310/photo/asian-little-boy-in-apron-preparing-baking-the-dough-in-kitchen-room-at-home.jpg?s=1024x1024&w=is&k=20&c=aNudLcwXdo9enISLIWnegnHetVPVDSrekk4KradNelM=",
    title: "Baking with kids: 20 recipes to make the Mar hols a delicious one",
    articleLink:
      "https://www.bbcgoodfood.com/howto/guide/top-5-easy-bakes-kids",
  },
  {
    image:
      "https://media.istockphoto.com/id/643847438/photo/restaurant-chilling-out-classy-lifestyle-reserved-concept.jpg?s=1024x1024&w=is&k=20&c=q4EJnuq8n65yvvddFbbN9lAoYRA2WuVsMH_AX1-BX6M=",
    title: "7 Healthy Lunch Tips for the Busy Executive",
    articleLink: "https://www.healthhub.sg/live-healthy/beat_lunch_hour_rush",
  },
  {
    image:
      "https://media.istockphoto.com/id/1369588490/photo/male-hands-with-flour.jpg?s=1024x1024&w=is&k=20&c=FZqCCpcN8C5YI_v-tu4kfTuPDe0VpEUjr_nKV5-PW_Q=",
    title: "Think you got what it takes to be Singapore's Best Amateur Baker?",
    articleLink:
      "https://contentdistribution.mediacorp.sg/products/creme-de-la-creme",
  },
];

function Card({ image, title, articleLink }) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <div>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      b
      <Button variant="white" color="dark" component="a" href={articleLink}>
        Read article
      </Button>
    </Paper>
  );
}

export default function CarouselCards() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = carouselData.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={{ base: "100%", sm: "50%" }}
      slideGap={{ base: rem(2), sm: "xl" }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
    >
      {slides}
    </Carousel>
  );
}
