import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { Paper, Title, Button, useMantineTheme, rem } from "@mantine/core";
import classes from "./CarouselCards.module.css";

const carouselData = [
  {
    image:
      "https://media.istockphoto.com/id/1176979263/photo/large-group-of-wholegrain-food-shot-on-rustic-wooden-table.jpg?s=1024x1024&w=is&k=20&c=4ejQttNi3x6M8JEWx9dDP2ShY9_q3i1Ok_tfCzQxV88=",
    title: "Mastering gluten-free baking",
    articleLink: "https://fasteasybread.com/gluten-free-baking/",
  },
  {
    image:
      "https://media.istockphoto.com/id/1297134259/photo/asian-chinese-6-years-old-boy-helping-his-grandmother-preparing-food-with-flour-baking-at.jpg?s=1024x1024&w=is&k=20&c=EdfBq1AxxbNaDyyh0j7wUfx1fMIEYOUT7tI5UoxkZYE=",
    title: "Baking with kids: 20 recipes to make the Mar hols a delicious one",
    articleLink:
      "https://www.bbcgoodfood.com/howto/guide/top-5-easy-bakes-kids",
  },
  {
    image:
      "https://media.istockphoto.com/id/875247342/photo/nothing-inspires-productivity-like-a-healthy-lunch.jpg?s=1024x1024&w=is&k=20&c=swAGlI33rFEFQmqDyCynwi1whrxVXRVdd9QI-I-bT1A=",
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
      withIndicators
      slideSize={{ base: "100%", sm: "50%", md: "100%" }}
      slideGap={{ base: rem(2), sm: "sm" }}
      align="start"
      height={250}
      slidesToScroll={mobile ? 4 : 1}
      loop
    >
      {slides}
    </Carousel>
  );
}
