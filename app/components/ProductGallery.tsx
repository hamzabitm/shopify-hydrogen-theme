import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <div className="product-gallery-placeholder">No image available</div>
        </div>
      </div>
    );
  }

  const mainImage = images[selectedImageIndex];

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="product-gallery-main">
        <Image
          alt={mainImage.altText || `${title} - Image ${selectedImageIndex + 1}`}
          aspectRatio="3/4"
          data={mainImage}
          key={mainImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
          className="product-gallery-main-image"
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="product-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`product-gallery-thumbnail ${
                index === selectedImageIndex ? 'active' : ''
              }`}
              onClick={() => setSelectedImageIndex(index)}
              type="button"
            >
              <Image
                alt={image.altText || `${title} - Thumbnail ${index + 1}`}
                aspectRatio="3/4"
                data={image}
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
